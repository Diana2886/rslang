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
    // const auth = new AuthController();
    // const headerCont = document.querySelector('.header-container') as HTMLElement;
    // headerCont.addEventListener('click', (e) => {
      // const target = e.target as HTMLElement;
      // if (target.classList.contains(`#${PageIds.Register}`)) {
        // auth.checkForm();
      // }
    // });
  }
}
