import Model from '../model/components/index';
import AppView from '../view/pages/app/index';
import HeaderController from './headerController';
import AuthController from './auth/auth';

export default class App {
  start() {
    const model = new Model();
    const view = new AppView();
    view.render();
    const headerController = new HeaderController();
    headerController.listenHeaderButtons();
    const login = new AuthController();
    login.checkElem();
  }
}
