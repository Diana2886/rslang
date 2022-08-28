import MainPage from '../main/index';
import Page from '../../core/templates/page';
import StatisticsPage from '../statistics/index';
import Header from '../../core/components/header/index';
import PageIds from './pageIds';
import ErrorPage, { ErrorTypes } from '../error/index';
import TextbookPage from '../textbook/index';
import AudioChallenge from '../audioChallenge/index';
import DifficultWordsPage from '../difficultWords/index';
import Sprint from '../sprint/index';
import LogInPage from '../logIn/index';

class AppView {
  private static container: HTMLElement = document.createElement('div');

  private static defaultPageId = 'current-page';

  public header: Header;

  constructor() {
    this.header = new Header('header', 'header-container');
  }

  static renderNewPage(idPage: string) {
    const currentPageHTML = document.querySelector(`#${AppView.defaultPageId}`);
    if (currentPageHTML) {
      currentPageHTML.remove();
    }
    let page: Page | null = null;
    switch (idPage) {
      case `${PageIds.Main}`:
        page = new MainPage(idPage);
        break;
      case `${PageIds.LogIn}`:
        page = new LogInPage(idPage);
        break;
      case `${PageIds.Statistics}`:
        page = new StatisticsPage(idPage);
        break;
      case `${PageIds.Textbook}`:
        page = new TextbookPage(idPage);
        break;
      case `${PageIds.AudioChallenge}`:
        page = new AudioChallenge(idPage);
        break;
      case `${PageIds.Sprint}`:
        page = new Sprint(idPage);
        break;
      case `${PageIds.DifficultWords}`:
        page = new DifficultWordsPage(idPage);
        break;
      default:
        page = new ErrorPage(idPage, ErrorTypes.Error_404);
    }

    if (page) {
      const pageHTML = page.render();
      pageHTML.id = AppView.defaultPageId;
      AppView.container.append(pageHTML);
      AppView.container.classList.add('container');
      document.body.append(AppView.container);
    }
  }

  private enableRouteChange() {
    let checker = '';
    Header.navContainer.addEventListener('click', (e) => {
      checker = 'checked';
      const target = e.target as HTMLAnchorElement;
      const name = target.dataset.page;
      if (name !== undefined) {
        AppView.renderNewPage(name);
      }
    });

    window.addEventListener('hashchange', () => {
      if (checker === 'checked') {
        checker = '';
      } else {
        const hash = window.location.hash.slice(1);
        AppView.renderNewPage(hash);
      }
    });
  }

  run() {
    AppView.container.append(this.header.render());
    const hash = window.location.hash.slice(1);
    if (hash) AppView.renderNewPage(hash);
    else AppView.renderNewPage('main-page');
    this.enableRouteChange();
  }
}

export default AppView;
