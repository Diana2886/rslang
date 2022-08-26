import ApiModel from '../model/components/index';
import TextbookModel from '../model/textbookModel';
import AppView from '../view/pages/app/index';
import HeaderController from './headerController';
import TextbookController from './textbookController';

class App {
  start() {
    const model = new ApiModel();
    TextbookModel.setLocalStorageSettings();
    const view = new AppView();
    view.render();
    const headerController = new HeaderController();
    headerController.listenHeaderButtons();
    const textbookController = new TextbookController();
    textbookController.listenPlayWordButton();
    textbookController.listenLevelButton();
    textbookController.listenPageButton();
  }
}

export default App;
