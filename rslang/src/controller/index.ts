import Model from '../model/components/index';
import AppView from '../view/pages/app/index';
import HeaderController from './headerController';
import AuthController from './auth/auth';
import SprintController from './sprint/sprint';

export default class App {
  start() {
    const model = new Model();
    const view = new AppView();
    view.run();
    const headerController = new HeaderController();
    headerController.listenHeaderButtons();
    const login = new AuthController();
    login.checkElem();
    const sprint = new SprintController();
    sprint.checkSprintElem();
  }
}
