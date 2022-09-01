import c3 from 'c3';
import 'c3/c3.min.css';
import { IChartData, IStatData } from '../../../types/index';
import './statistics.scss';
import StatData from './statData';

export default class ViewStat {
  statData: StatData;

  data: IStatData;

  newsChartsData: IChartData[];

  learnedChartsData: IChartData[];

  constructor() {
    this.statData = new StatData();
    this.data = this.statData.data;
    this.newsChartsData = [];
    this.learnedChartsData = [];
  }

  async drawDayStats() {
    const { data, periodData } = await this.statData.getData();
    this.data = data;
    if (periodData) {
      const { newsChartData, learnedChartData } = periodData;
      this.newsChartsData = newsChartData;
      this.learnedChartsData = learnedChartData;
    }
    const statBody = document.createElement('div');
    statBody.className = 'statistic__body';
    const commonDaily = this.drawDayItem('common');
    const audioDaily = this.drawDayItem('audio');
    const sprintDaily = this.drawDayItem('sprint');
    const gameDaily = document.createElement('div');
    gameDaily.className = 'statistic__games-block';
    // [audioDaily, sprintDaily].forEach((item) => gameDaily.append(item));
    [commonDaily, audioDaily, sprintDaily].forEach((item) => statBody.append(item));
    return statBody;
  }

  drawDayItem(type: 'common' | 'audio' | 'sprint') {
    const dayStat = document.createElement('div');
    dayStat.className = `statistic__day-${type} day-${type}`;
    const commonStatTitle = document.createElement('h5');
    commonStatTitle.textContent = type.toUpperCase();

    const newWordsInfo = document.createElement('p');

    newWordsInfo.className = `day-${type}__new-words`;
    newWordsInfo.innerHTML = `<span>New words</span>: ${this.data[type].newWords}`;

    const dayWinsInfo = document.createElement('p');
    dayWinsInfo.className = `day-${type}__wins`;
    const winsProcStr = this.data[type].winsPercent ? this.data[type].winsPercent : 'not played';
    if (winsProcStr !== false) {
      dayWinsInfo.innerHTML = `<span>Correct answers</span>: ${winsProcStr}${winsProcStr !== 'not played' ? '%' : ''}`;
    }
    [commonStatTitle, newWordsInfo, dayWinsInfo].forEach((item) => dayStat.append(item));
    if (type !== 'common') {
      const dayBestInfo = document.createElement('p');
      dayBestInfo.className = `day-${type}__best`;
      dayBestInfo.innerHTML = `<span>Best win streak:</span> ${this.data[type].bestSeries}`;
      const dayLearnedInfo = document.createElement('p');
      dayLearnedInfo.className = `day-${type}__learned`;
      dayLearnedInfo.innerHTML = `<span>Learned words</span>: ${this.data[type].learned}`;
      [dayBestInfo, dayLearnedInfo].forEach((item) => dayStat.append(item));
    } else {
      const dayLearnedInfo = document.createElement('p');
      const dayTextLearnedInfo = document.createElement('p');
      dayTextLearnedInfo.className = `day-textbook__learned`;
      dayTextLearnedInfo.innerHTML = `<span>Textbook learned</span>: ${this.data.textbook.learned}`;

      dayLearnedInfo.className = `day-${type}__learned`;
      dayLearnedInfo.innerHTML = `<span>All learned</span>: ${this.data[type].learned}`;
      [dayLearnedInfo, dayTextLearnedInfo].forEach((item) => dayStat.append(item));
    }
    return dayStat;
  }

  drawChart() {
    const chartDiv = document.createElement('div');
    chartDiv.className = `chart`;
    const chart = c3.generate({
      bindto: '#chart',
      data: {
        x: 'x',
        columns: [
          [
            'x',
            ...this.newsChartsData.map(
              (item) => `${item.date.getFullYear()}-${item.date.getMonth()}-${item.date.getDate()}`
            ),
          ],
          ['New words', ...this.newsChartsData.map((item) => item.value)],
          ['Learned words', ...this.learnedChartsData.map((item) => item.value)],
        ],
        type: 'bar',
      },
      color: {
        pattern: ['#545BE8', '#F0C932'],
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%d.%m',
          },
        },
      },
    });
    chartDiv.append(chart.element);
    return chartDiv;
  }
}
