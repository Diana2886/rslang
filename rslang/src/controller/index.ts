import TextbookModel from '../model/textbookModel';
import AppView from '../view/pages/app/index';
import HeaderController from './headerController';
import TextbookController from './textbookController';
import AuthController from './auth/auth';
import SprintController from './sprint/sprint';

class App {
  start() {
    const view = new AppView();
    view.run();
    const headerController = new HeaderController();
    headerController.listenHeaderButtons();
    this.startTextbookPage();
    const login = new AuthController();
    login.checkElem();
    const sprint = new SprintController();
    sprint.checkSprintElem();
  }

  startTextbookPage() {
    TextbookModel.setLocalStorageSettings();
    const textbookController = new TextbookController();
    textbookController.listenPlayWordButton();
    textbookController.listenLevelButton();
    textbookController.listenPageButton();
    textbookController.listenWordButtons();
    textbookController.listenDifficultWordsButton();
    textbookController.listenSettingsModalWindow();
  }
}

export default App;
