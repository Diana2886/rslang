import './statistics.scss';
import { IStatData } from '../../../types/index';
import StatData from './statData';

export default class ViewStat {
  statData: StatData;

  data: IStatData;

  constructor() {
    this.statData = new StatData();
    this.data = this.statData.data;
  }

  async drawDayStats() {
    this.data = await this.statData.getData();
    const statBody = document.createElement('div');
    statBody.className = 'statistic__body';
    const commonDaily = this.drawDayItem('common');
    const audioDaily = this.drawDayItem('audio');
    const sprintDaily = this.drawDayItem('sprint');
    const gameDaily = document.createElement('div');
    gameDaily.className = 'statistic__games-block';
    [audioDaily, sprintDaily].forEach((item) => gameDaily.append(item));
    [commonDaily, gameDaily].forEach((item) => statBody.append(item));
    return statBody;
  }

  drawDayItem(type: 'common' | 'audio' | 'sprint') {
    const dayStat = document.createElement('div');
    dayStat.className = `statistic__day-${type} day-${type}`;
    const commonStatTitle = document.createElement('h6');
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
      dayStat.append(dayBestInfo);
    } else {
      const dayLearnedInfo = document.createElement('p');
      dayLearnedInfo.className = `day-${type}__learned`;
      dayLearnedInfo.innerHTML = `<span>Learned words</span>: ${this.data[type].learned}`;
      dayStat.append(dayLearnedInfo);
    }
    return dayStat;
  }
}
