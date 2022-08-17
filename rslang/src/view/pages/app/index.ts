import MainPage from '../main/index';
import Page from '../../core/templates/page';
import AuthorizationPage from '../authorization/index';
import StatisticsPage from '../statistics/index';
import Header from '../../core/components/header/index';
import PageIds from './pageIds';
import ErrorPage, { ErrorTypes } from '../error/index';

class App {
  private static container: HTMLElement = document.body;

  private static defaultPageId = 'current-page';

  private header: Header;

  constructor() {
    this.header = new Header('header', 'header-container');
  }

  static renderNewPage(idPage: string) {
    const currentPageHTML = document.querySelector(`#${App.defaultPageId}`);
    if (currentPageHTML) {
      currentPageHTML.remove();
    }
    let page: Page | null = null;

    if (idPage === PageIds.Main) {
      page = new MainPage(idPage);
    } else if (idPage === PageIds.Authorization) {
      page = new AuthorizationPage(idPage);
    } else if (idPage === PageIds.Statistics) {
      page = new StatisticsPage(idPage);
    } else {
      page = new ErrorPage(idPage, ErrorTypes.Error_404);
    }

    if (page) {
      const pageHTML: HTMLElement = page.render();
      pageHTML.id = App.defaultPageId;
      App.container.append(pageHTML);
    }
  }

  private enableRouteChange() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      App.renderNewPage(hash);
    });
  }

  run() {
    App.container.append(this.header.render());
    App.renderNewPage('main-page');
    this.enableRouteChange();
  }
}

export default App;
