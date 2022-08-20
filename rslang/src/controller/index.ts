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
    container.addEventListener('click', (e) => {
      const targ = e.target as HTMLElement;
      if (targ.classList.contains(PageIds.Register)) {
        const loginBtn = document.querySelector('.logIn-page button') as HTMLButtonElement;
        auth.checkRegister(targ, loginBtn);
      } else if (targ.classList.contains(PageIds.LogIn)) {
        const registerBtn = document.querySelector('.register-page') as HTMLButtonElement;
        auth.checkLogin(registerBtn, targ);
      }
    });
  }
}
