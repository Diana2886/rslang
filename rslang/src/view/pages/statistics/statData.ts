import Model from '../../../model/components/index';
import { IChartData, IStatData, IStatistic } from '../../../types/index';

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
    const key = `${Math.ceil(date.getMinutes())}/${date.getMonth()}/${date.getFullYear()}`;
    this.statistic = await this.model.getStatistic();
    const userWords = await this.model.getUserWords();
    let periodData: { newsChartData: IChartData[]; learnedChartData: IChartData[] } | null = null;
    if (typeof this.statistic === 'object') {
      periodData = this.getPeriodData(this.statistic);
    }
    if (typeof this.statistic === 'object' && this.statistic.optional[key]) {
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
        if (uWord.optional?.audio[key]) {
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
    return { data: this.data, periodData };
  }

  getPeriodData(stat: IStatistic) {
    let newsChartData: IChartData[] = [];
    let learnedChartData: IChartData[] = [];

    const { optional } = stat;
    const dateKeys = Object.keys(optional);
    const getChartData = (name: 'newWords' | 'learnedWords') => {
      const chartData = [
        ...dateKeys.map((dateStr) => {
          const dayData = optional[dateStr];
          const value = dayData.audio[name] + dayData.sprint[name] + dayData.textbook[name];
          const [day, month, year] = dateStr.split('/');
          const date = new Date(+year, +month, +day);
          return { date, value };
        }),
      ];
      return chartData;
    };
    newsChartData = getChartData('newWords');
    learnedChartData = getChartData('learnedWords');

    return { newsChartData, learnedChartData };
  }
}
