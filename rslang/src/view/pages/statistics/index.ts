import Model from '../../../model/components/index';
import Footer from '../../core/components/footer/index';
import Page from '../../core/templates/page';
import ViewStat from './statView';

class StatisticsPage extends Page {
  model = new Model();

  statView = new ViewStat();

  drawStatPage() {
    const statSection = document.createElement('div');
    const spinnerBlock = document.createElement('div');
    spinnerBlock.className = 'spinner-block';
    spinnerBlock.innerHTML = `<div class="d-flex justify-content-center">
    <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
  </div>`;
    statSection.append(spinnerBlock);
    statSection.className = 'statistic';
    const authStr = localStorage.getItem('authDataRSlang');
    if (authStr) {
      this.statView
        .drawDayStats()
        .then((element) => {
          statSection.innerHTML = '';
          const titleDaily = document.createElement('h3');
          titleDaily.textContent = 'Daily statistics';
          const titleLong = document.createElement('h3');
          titleLong.textContent = 'Long term statistics';
          statSection.append(titleDaily);
          statSection.append(element);
          statSection.append(titleLong);
          statSection.append(this.statView.drawChart());
        })
        .catch((err) => console.warn(err));
    } else {
      statSection.innerHTML = '';
      statSection.append(this.drawUnAuthInfo());
    }
    return statSection;
  }

  drawUnAuthInfo() {
    const info = document.createElement('div');
    info.className = 'statistics__info';
    info.innerHTML = `<h5>Statistics are available only for authorized users.</h5> <h5>Please, login or register.</h5>`;
    return info;
  }

  render() {
    const footer = new Footer();
    this.container.innerHTML = '';
    this.container.append(this.drawStatPage(), footer.renderFooter());
    return this.container;
  }
}

export default StatisticsPage;
