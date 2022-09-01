import Model from '../../../model/components/index';
import Footer from '../../core/components/footer/index';
import Page from '../../core/templates/page';
import ViewStat from './statView';

class StatisticsPage extends Page {
  model = new Model();

  statView = new ViewStat();

  drawStatPage() {
    const statSection = document.createElement('div');
    statSection.className = 'statistic';
    const titleDaily = document.createElement('h3');
    titleDaily.textContent = 'Daily statistics';
    const titleLong = document.createElement('h3');
    titleLong.textContent = 'Long term statistics';
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
    const footer = new Footer();
    this.container.innerHTML = '';
    this.container.append(this.drawStatPage(), footer.renderFooter());
    return this.container;
  }
}

export default StatisticsPage;
