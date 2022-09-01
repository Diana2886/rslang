import Model from '../../model/components/index';
import { IUserWord, IWord } from '../../types/index';

export default class Statistic {
  model: Model;

  constructor() {
    this.model = new Model();
  }

  async writeWordStat(gameName: 'audio' | 'sprint', example: IWord, answers: boolean) {
    const date = new Date();
    const key = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    const userWords = await this.model.getUserWords();
    let userWord: IUserWord = {};
    let resUWord: number | IUserWord = 0;
    if (typeof userWords === 'object') {
      if (userWords.some((word) => word.wordId === example.id)) {
        resUWord = await this.model.getUserWord(example.id);
        if (typeof resUWord === 'object') {
          userWord = resUWord;
        }
      } else {
        userWord.optional = {
          audio: {
            [key]: {
              allGames: 0,
              corrects: 0,
            },
          },
          sprint: {
            [key]: {
              allGames: 0,
              corrects: 0,
            },
          },
          serial: 0,
        };
      }

      if (userWord.optional) {
        if (!userWord.optional.audio[key]) {
          userWord.optional.audio[key] = {
            allGames: 0,
            corrects: 0,
          };
          userWord.optional.sprint[key] = {
            allGames: 0,
            corrects: 0,
          };
        }
        userWord.optional[gameName][key].allGames += 1;
        userWord.optional[gameName][key].corrects += answers ? 1 : 0;
        userWord.optional.serial = answers ? userWord.optional.serial + 1 : 0;
        if (answers) {
          await this.checkSerial(userWord, gameName, key);
        } else if (userWord.difficulty === 'learned') {
          userWord.difficulty = 'new';
          await this.writeGlobalStat('learned', `${gameName}`, key, true);
        }
      }
      if (typeof resUWord === 'object') {
        if (userWord.wordId) {
          if (userWord.optional) {
            const { audio, sprint } = userWord.optional;
            let allGames = 0;
            const values = [...Object.values(audio), ...Object.values(sprint)];
            values.forEach((item) => {
              allGames += item.allGames;
            });
            if (allGames === 1) {
              await this.writeGlobalStat('new', gameName, key);
            }
          }
          await this.model.updateUserWord(userWord.wordId, {
            difficulty: userWord.difficulty,
            optional: userWord.optional,
          });
        }
      } else {
        await this.model.createUserWord(example.id, { difficulty: 'new', optional: userWord.optional });
        await this.writeGlobalStat('new', gameName, key);
      }
      await this.writeBestSerial(gameName, answers, key);
    }
  }

  async checkSerial(userWord: IUserWord, gameName: 'audio' | 'sprint' | 'textbook', key: string) {
    if (userWord.difficulty === 'difficult') {
      if (userWord.optional?.serial === 5) {
        userWord.difficulty = 'learned';
        await this.writeGlobalStat('learned', gameName, key);
      }
    } else if (userWord.optional?.serial === 3) {
      userWord.difficulty = 'learned';
      await this.writeGlobalStat('learned', gameName, key);
    }
  }

  async writeGlobalStat(
    type: 'new' | 'learned',
    source: 'audio' | 'sprint' | 'textbook',
    key: string,
    minus?: boolean
  ) {
    let statistic = await this.model.getStatistic();
    if (typeof statistic === 'number') {
      statistic = {
        learnedWords: 0,
        optional: {
          [key]: {
            audio: {
              newWords: 0,
              learnedWords: 0,
              series: 0,
              bestSeries: 0,
            },
            sprint: {
              newWords: 0,
              learnedWords: 0,
              series: 0,
              bestSeries: 0,
            },
            textbook: {
              newWords: 0,
              learnedWords: 0,
              series: 0,
              bestSeries: 0,
            },
          },
        },
      };
    }

    if (typeof statistic === 'object') {
      if (!statistic.optional[key]) {
        statistic.optional[key] = {
          audio: {
            newWords: 0,
            learnedWords: 0,
            series: 0,
            bestSeries: 0,
          },
          sprint: {
            newWords: 0,
            learnedWords: 0,
            series: 0,
            bestSeries: 0,
          },
          textbook: {
            newWords: 0,
            learnedWords: 0,
            series: 0,
            bestSeries: 0,
          },
        };
      }
    }

    if (type === 'new') {
      const dayStat = statistic.optional[key];
      dayStat[source].newWords += 1;
    }
    if (type === 'learned') {
      statistic.learnedWords += minus ? -1 : 1;
      const dayStat = statistic.optional[key];
      dayStat[source].learnedWords += minus ? -1 : 1;
    }

    await this.model.updateStatistic({ learnedWords: statistic.learnedWords, optional: statistic.optional });
  }

  async writeBestSerial(type: 'audio' | 'sprint', answer: boolean, date: string) {
    const statistic = await this.model.getStatistic();
    if (typeof statistic === 'object') {
      if (!statistic.optional[date]) {
        const { optional } = statistic;
        const keys = Object.keys(optional);
        date = keys[keys.length - 1];
      }
      const best = statistic.optional[date][type].bestSeries;
      const current = statistic.optional[date][type].series;
      if (answer) {
        statistic.optional[date][type].series += 1;
        if (current + 1 > best) {
          statistic.optional[date][type].bestSeries = current + 1;
        }
        await this.model.updateStatistic({ learnedWords: statistic.learnedWords, optional: statistic.optional });
      } else if (current !== 0) {
        statistic.optional[date][type].series = 0;
        await this.model.updateStatistic({ learnedWords: statistic.learnedWords, optional: statistic.optional });
      }
    }
  }
}
