import Model from '../model/components/index';
import AppView from '../view/pages/app/index';
import HeaderController from './headerController';

class App {
  start() {
    const model = new Model();
    const view = new AppView();
    view.render();
    const headerController = new HeaderController();
    headerController.listenHeaderButtons();
  }
}

export default App;
