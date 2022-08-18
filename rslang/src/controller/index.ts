import AuthController from './auth/auth';
import App from '../view/pages/app/index';
import Model from '../model/components/index';
import PageIds from '../view/pages/app/pageIds';
// listener
export default class Controller {
  start() {
    const view = new App();
    const model = new Model();
    view.run();
    const auth = new AuthController();
    const container = document.querySelector('.container') as HTMLElement;
    container.addEventListener('click', (e) => {
      const targ = e.target as HTMLElement;
      if (targ.classList.contains('register-page')) {
        auth.checkForm();
      }
    });
  }
}
