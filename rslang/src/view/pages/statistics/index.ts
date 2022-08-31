import Model from '../../../model/components/index';
import Page from '../../core/templates/page';
import ViewStat from './statView';

class StatisticsPage extends Page {
  model = new Model();

  statView = new ViewStat();

  drawStatPage() {
    const statSection = document.createElement('div');
    statSection.className = 'statistic';
    this.statView
      .drawDayStats()
      .then((element) => {
        statSection.append(element);
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
