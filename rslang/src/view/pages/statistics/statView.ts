import { IStatData } from '../../../types/index';
import StatData from './statData';

export default class ViewStat {
  statData: StatData;

  data: IStatData;

  constructor() {
    this.statData = new StatData();
    this.data = this.statData.data;
  }

  async drawStats() {
    const statBody = document.createElement('div');
    statBody.className = 'statistic__body';
    const commonDaily = await this.drawCommonDayStat();
    statBody.append(commonDaily);
    return statBody;
  }

  async drawCommonDayStat() {
    this.data = await this.statData.getData();
    const { dayNewWords, dayLearned, dayWinsProc } = this.data;
    const commonDayStat = document.createElement('div');

    commonDayStat.className = 'statistic__day-common day-common';
    const commonStatTitle = document.createElement('h5');
    commonStatTitle.textContent = 'Daily common statistics';

    const newWordsInfo = document.createElement('p');

    newWordsInfo.className = 'day-common__new-words';
    newWordsInfo.innerHTML = `<span>New words</span>: ${dayNewWords}`;

    const dayLearnedInfo = document.createElement('p');
    dayLearnedInfo.className = 'day-common__learned';
    dayLearnedInfo.innerHTML = `<span>Learned words</span>: ${dayLearned}`;

    const dayWinsInfo = document.createElement('p');
    dayWinsInfo.className = 'day-common__wins';
    const winsProcStr = dayWinsProc ? `${dayWinsProc}%` : 'no games';
    dayWinsInfo.innerHTML = `<span>Correct answers</span>: ${winsProcStr}`;

    [commonStatTitle, newWordsInfo, dayLearnedInfo, dayWinsInfo].forEach((item) => commonDayStat.append(item));
    return commonDayStat;
  }
}
