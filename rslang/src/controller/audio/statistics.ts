import Model from '../../model/components/index';
import { GameData, IOptional, IUser, IUserWord } from '../../types/index';

export default class AudioStatistic {
  model: Model;

  constructor() {
    this.model = new Model();
  }

  writeWordStat(userWords: IUserWord[], example: GameData, answers: boolean) {
    const date = new Date();
    const key = `${date.getDate()}${date.getMonth()}${date.getFullYear()}`;
    console.log(key);
    if (userWords.some((word) => word.wordId === example.word.id)) {
      let userWord: IUserWord;
      this.model
        .getUserWord(example.word.id)
        .then((res) => {
          if (typeof res === 'object') {
            userWord = res;
            if (userWord.optional) {
              userWord.optional.audio[key].allGames += 1;
              userWord.optional.audio[key].corrects += answers ? 1 : 0;
              userWord.optional.serial = answers ? userWord.optional.serial + 1 : 0;
              if (answers) {
                this.checkSerial(userWord);
              }
            }
            if (userWord.wordId) {
              console.log(userWord);
              this.model
                .updateUserWord(userWord.wordId, {
                  difficulty: userWord.difficulty,
                  optional: userWord.optional,
                })
                .catch((err) => console.error(err));
            }
          }
        })
        .catch((err) => console.log(err));
    } else {
      const optional: IOptional = {
        audio: {
          [key]: {
            allGames: 1,
            corrects: 1,
          },
        },
        sprint: {
          [key]: {
            allGames: 0,
            corrects: 0,
          },
        },
        serial: 1,
      };
      this.model
        .createUserWord(example.word.id, { difficulty: 'new', optional })
        .then(() => console.log('created'))
        .catch((err) => console.log(err));
    }
  }

  checkSerial(userWord: IUserWord) {
    if (userWord.difficulty === 'difficult') {
      if (userWord.optional?.serial === 5) {
        userWord.difficulty = 'learned';
      }
    } else if (userWord.optional?.serial === 3) {
      userWord.difficulty = 'learned';
    }
  }
}
