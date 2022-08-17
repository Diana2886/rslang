import { AuthController } from './auth/auth';
import { App } from '../view/pages/app/index';
import Model from '../model/components/index';
// listener
export default class Controller {
  model: Model;

  view: App;

  constructor() {
    this.model = new Model();
    this.view = new App();
  }

  start() {
    this.view.run();
    const auth = new AuthController();
    console.log(auth);
    document.addEventListener('load', () => {
      auth.checkForm();
    });
  }
}
