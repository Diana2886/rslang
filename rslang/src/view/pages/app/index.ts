import MainPage from '../main/index';
import Page from '../../core/templates/page';
import RegisterPage from '../register/index';
import StatisticsPage from '../statistics/index';
import Header from '../../core/components/header/index';
import PageIds from './pageIds';
import ErrorPage, { ErrorTypes } from '../error/index';
import TextbookPage from '../textbook/index';
import AudioChallenge from '../audioChallenge/index';
import WordListPage from '../wordList/index';
import Sprint from '../sprint/index';
import LogInPage from '../logIn/logIn';

class App {
  private static container: HTMLElement = document.createElement('div');

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

    switch (idPage) {
      case `${PageIds.Main}`:
        page = new MainPage(idPage);
        break;
      case `${PageIds.Register}`:
        page = new RegisterPage(idPage);
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
      case `${PageIds.WordList}`:
        page = new WordListPage(idPage);
        break;
      default:
        page = new ErrorPage(idPage, ErrorTypes.Error_404);
    }

    if (page) {
      const pageHTML = page.render();
      pageHTML.id = App.defaultPageId;
      App.container.append(pageHTML);
      App.container.classList.add('container');
      document.body.append(App.container);
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
