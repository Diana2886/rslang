/* eslint-disable @typescript-eslint/no-misused-promises */
import Model, { Result } from '../../model/components/index';
import { IEmpyObj, ISignIn, IUser } from '../../types/index';
import AppView from '../../view/pages/app/index';
import PageIds from '../../view/pages/app/pageIds';

class AuthController {
  userRegistrInfo: IEmpyObj;

  model: Model;

  constructor() {
    this.model = new Model();
    this.userRegistrInfo = {};
  }

  checkElem() {
    const container = document.querySelector('.container') as HTMLElement;
    container.addEventListener('click', (e) => {
      const targ = e.target as HTMLElement;
      if (targ.dataset.page === PageIds.LogIn) {
        targ.innerHTML = 'Log in';
        localStorage.removeItem('sthmPasMail');
        localStorage.removeItem('authDataRSlang');
        this.checkLogin(targ);
      }
    });
  }

  checkLogin(loginBtn: HTMLElement) {
    const form = document.querySelector('.form') as HTMLElement;
    const createBtn = document.querySelector('.createAccountBtn') as HTMLButtonElement;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    createBtn.addEventListener('click', this.checkRegister);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const target = e.target as HTMLFormElement;
      const email = (target[0] as HTMLInputElement).value.toString();
      const password = (target[1] as HTMLInputElement).value.toString();
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      password.length <= 7 ? target[1].classList.add('is-invalid') : target[1].classList.remove('is-invalid');
      const obj: ISignIn = { email, password };

      const resStatus = await this.model.signIn(obj);

      if (resStatus === 200) {
        loginBtn.textContent = 'Log Out';
        AppView.renderNewPage('main-page');
        target.reset();
      } else {
        const alertPlaceholder = document.querySelector('#error-alert') as HTMLElement;
        if (alertPlaceholder.children.length === 0) {
          AuthController.alert2(alertPlaceholder, 'Account not found', 'danger');
          setTimeout(() => {
            alertPlaceholder.children[0].remove();
          }, 2000);
        } else {
          alertPlaceholder.children[0].remove();
        }
      }
    });
  }

  static alert2(elem: HTMLElement, message: string, type: string) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <div class="animate__zoomIn alert alert-${type} d-flex align-items-center" role="alert">
      <svg width="15px" height="15px" xmlns="http://www.w3.org/2000/svg" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </svg>
      <div>
        ${message}
      </div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Закрыть"></button>
    </div>
    `;

    elem.append(wrapper);
  }

  checkRegister() {
    const form = document.querySelector('.create-form') as HTMLElement;
    const alertPlaceholder = document.querySelector('#error-alert2') as HTMLElement;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const target = e.target as HTMLFormElement;
      const name = (target[0] as HTMLInputElement).value.toString();
      const email = (target[1] as HTMLInputElement).value.toString();
      const password = (target[2] as HTMLInputElement).value.toString();
      this.userRegistrInfo = { name, email, password };
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      password.length <= 7 ? target[1].classList.add('is-invalid') : target[1].classList.remove('is-invalid');
      const model = new Model();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const user: IUser = JSON.parse(JSON.stringify(this.userRegistrInfo));
      const status = await model.createUser(user);
      switch (status) {
        case Result.success:
          if (alertPlaceholder.children.length === 0) {
            AuthController.alert2(alertPlaceholder, 'you successfully registered, now you need to log in', 'success');
            setTimeout(() => {
              alertPlaceholder.children[0].remove();
            }, 2000);
          } else {
            alertPlaceholder.children[0].remove();
          }
          target.reset();
          break;
        case Result.exist_email:
          if (alertPlaceholder.children.length === 0) {
            AuthController.alert2(alertPlaceholder, 'E-mail exsist', 'danger');
            setTimeout(() => {
              alertPlaceholder.children[0].remove();
            }, 2000);
          } else {
            alertPlaceholder.children[0].remove();
          }
          break;
        case Result.wrong_email_password:
          if (alertPlaceholder.children.length === 0) {
            AuthController.alert2(alertPlaceholder, 'wrong name, email or password', 'danger');
            setTimeout(() => {
              alertPlaceholder.children[0].remove();
            }, 2000);
          } else {
            alertPlaceholder.children[0].remove();
          }
          break;
        default:
          break;
      }
    });
  }
}
export default AuthController;
