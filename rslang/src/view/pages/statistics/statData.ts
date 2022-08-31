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
      dayNewWords: 0,
      dayLearned: 0,
      dayWinsProc: 0,
      dayTextbookLearned: 0,
      dayAudioNew: 0,
      daySprintNew: 0,
      dayAudioSeries: 0,
      daySprintSeries: 0,
      dayAudioWinsProc: 0,
      daySprintWinsProc: 0,
      dayAudioLearned: 0,
      daySprintLearned: 0,
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
      this.data.dayAudioLearned = dayStat.audio.learnedWords;
      this.data.daySprintLearned = dayStat.sprint.learnedWords;
      this.data.dayTextbookLearned = dayStat.textbook.learnedWords;
      this.data.dayAudioNew = dayStat.audio.newWords;
      this.data.daySprintNew = dayStat.sprint.newWords;
      const currAudioSeries = dayStat.audio.series;
      const currAudioBest = dayStat.audio.bestSeries;
      this.data.dayAudioSeries = currAudioBest > currAudioSeries ? currAudioBest : currAudioSeries;
      const currSprintSeries = dayStat.sprint.series;
      const currSprintBest = dayStat.sprint.bestSeries;
      this.data.daySprintSeries = currSprintBest > currSprintSeries ? currSprintBest : currSprintSeries;
      this.data.dayLearned = this.data.dayAudioLearned + this.data.daySprintLearned + this.data.dayTextbookLearned;
      this.data.dayNewWords = this.data.dayAudioNew + this.data.daySprintNew;
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

      this.data.dayAudioWinsProc = dayAudioGames ? Math.round((dayAudioWins / dayAudioGames) * 100) : false;
      this.data.daySprintWinsProc = daySprintGames ? Math.round((daySprintWins / daySprintGames) * 100) : false;
      const allGames = dayAudioGames + daySprintGames;
      this.data.dayWinsProc = allGames ? Math.round(((dayAudioWins + daySprintWins) / allGames) * 100) : false;
    }
    return this.data;
  }
}
