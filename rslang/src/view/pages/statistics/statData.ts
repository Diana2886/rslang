import Model from '../../../model/components/index';
import { IStatData, IStatistic } from '../../../types/index';

export default class StatData {
  model: Model;

  data: IStatData;

  statistic: IStatistic | number;

  constructor() {
    this.model = new Model();
    this.data = {
      allLearned: 0,
      common: {
        learned: 0,
        newWords: 0,
        winsPercent: false,
      },
      audio: {
        learned: 0,
        newWords: 0,
        winsPercent: false,
        bestSeries: 0,
      },
      sprint: {
        learned: 0,
        newWords: 0,
        winsPercent: false,
        bestSeries: 0,
      },
      textbook: {
        learned: 0,
        newWords: 0,
      },
    };
    this.statistic = 0;
  }

  async getData() {
    const date = new Date();
    const key = `${date.getDate()}${date.getMonth()}${date.getFullYear()}`;
    this.statistic = await this.model.getStatistic();
    const userWords = await this.model.getUserWords();
    if (typeof this.statistic === 'object') {
      this.data.allLearned = this.statistic.learnedWords;
      const dayStat = this.statistic.optional[key];
      this.data.audio.learned = dayStat.audio.learnedWords;
      this.data.sprint.learned = dayStat.sprint.learnedWords;
      this.data.textbook.learned = dayStat.textbook.learnedWords;
      this.data.audio.newWords = dayStat.audio.newWords;
      this.data.sprint.newWords = dayStat.sprint.newWords;
      const currAudioSeries = dayStat.audio.series;
      const currAudioBest = dayStat.audio.bestSeries;
      this.data.audio.bestSeries = currAudioBest > currAudioSeries ? currAudioBest : currAudioSeries;
      const currSprintSeries = dayStat.sprint.series;
      const currSprintBest = dayStat.sprint.bestSeries;
      this.data.sprint.bestSeries = currSprintBest > currSprintSeries ? currSprintBest : currSprintSeries;
      this.data.common.learned = this.data.audio.learned + this.data.sprint.learned + this.data.textbook.learned;
      this.data.common.newWords = this.data.audio.newWords + this.data.sprint.newWords;
    }
    if (typeof userWords === 'object') {
      let dayAudioGames = 0;
      let dayAudioWins = 0;
      let daySprintGames = 0;
      let daySprintWins = 0;
      userWords.forEach((uWord) => {
        if (uWord.optional) {
          dayAudioGames += uWord.optional.audio[key].allGames;
          dayAudioWins += uWord.optional.audio[key].corrects;
          daySprintGames += uWord.optional.sprint[key].allGames;
          daySprintWins += uWord.optional.sprint[key].corrects;
        }
      });

      this.data.audio.winsPercent = dayAudioGames ? Math.round((dayAudioWins / dayAudioGames) * 100) : false;
      this.data.sprint.winsPercent = daySprintGames ? Math.round((daySprintWins / daySprintGames) * 100) : false;
      const allGames = dayAudioGames + daySprintGames;
      this.data.common.winsPercent = allGames ? Math.round(((dayAudioWins + daySprintWins) / allGames) * 100) : false;
    }
    return this.data;
  }
}
