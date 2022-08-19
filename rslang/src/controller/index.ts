import AuthController from './auth/auth';
// eslint-disable-next-line import/no-cycle
import App from '../view/pages/app/index';
import Model from '../model/components/index';
import PageIds from '../view/pages/app/pageIds';

// listener
export default class Controller {
  start() {
    const view = new App();
    const model = new Model();
    view.run();
    this.checkElem();
  }

  checkElem() {
    const auth = new AuthController();
    const container = document.querySelector('.container') as HTMLElement;
    // console.log(auth);
    container.addEventListener('click', (e) => {
      const targ = e.target as HTMLElement;
      // console.log(targ);
      if (targ.classList.contains(PageIds.Register)) {
        auth.checkRegister();
      } else if (targ.classList.contains(PageIds.LogIn)) {
        auth.checkLogin();
      }
    });
  }
}
