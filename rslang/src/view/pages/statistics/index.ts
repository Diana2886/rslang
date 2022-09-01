import Model from '../../../model/components/index';
import Page from '../../core/templates/page';
import ViewStat from './statView';

class StatisticsPage extends Page {
  model = new Model();

  statView = new ViewStat();

  drawStatPage() {
    const statSection = document.createElement('div');
    statSection.className = 'statistic';
    const titleDaily = document.createElement('h5');
    titleDaily.textContent = 'Daily statistics';
    const titleLong = document.createElement('h5');
    titleLong.textContent = 'Long term statistic';
    statSection.append(titleDaily);
    this.statView
      .drawDayStats()
      .then((element) => {
        statSection.append(element);
        statSection.append(titleLong);
        statSection.append(this.statView.drawChart());
      })
      .catch((err) => console.log(err));

    return statSection;
  }

  render() {
    this.container.innerHTML = '';
    this.container.append(this.drawStatPage());
    return this.container;
  }
}

export default StatisticsPage;
