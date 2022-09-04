/* eslint-disable @typescript-eslint/no-misused-promises */
import Model, { Result } from '../../model/components/index';
import { IEmpyObj, ISignIn, IUser } from '../../types/index';
import PageIds from '../../view/pages/app/pageIds';
import LogInPage from '../../view/pages/logIn/index';
import TextbookController from '../textbookController';

class AuthController {
  userRegistrInfo: IEmpyObj;

  model: Model;

  EMAIL_REGEXP: RegExp;

  constructor() {
    this.model = new Model();
    this.userRegistrInfo = {};
    this.EMAIL_REGEXP =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
  }

  checkElem() {
    const container = document.querySelector('.container') as HTMLElement;
    container.addEventListener('click', (e) => {
      const targ = e.target as HTMLElement;
      if (targ.dataset.page === PageIds.LogIn) {
        targ.innerHTML = 'Log in';
        localStorage.removeItem('sthmPasMail');
        localStorage.removeItem('newUserDataRSlang');
        localStorage.removeItem('authDataRSlang');
        const modal = LogInPage.authModal();
        container.after(modal);
        this.loginPage(modal, targ);
      }
    });
  }

  loginPage(elem: HTMLElement, loginBtn: HTMLElement) {
    elem.addEventListener('click', async (e) => {
      const targ = e.target as HTMLElement | HTMLButtonElement | HTMLInputElement;

      if (targ.classList.contains('auth-modal-bg')) {
        this.closeModal();
      } else if (targ.classList.contains('close-modal')) {
        this.closeModal();
      } else if (targ.classList.contains('login')) {
        await this.checkLoginBtn(loginBtn);
      } else if (targ.classList.contains('createUser')) {
        this.registerPage();
      } else if (targ.classList.contains('form-control')) {
        this.checkInput(targ);
      } else if (targ.classList.contains('back-login')) {
        this.logInPage();
      } else if (targ.classList.contains('register')) {
        await this.checkRegisterBtn(loginBtn);
      }
    });
  }

  registerPage() {
    const register = document.querySelector('.register-modal') as HTMLElement;
    const login = document.querySelector('.login-modal') as HTMLElement;
    register.classList.add('modal-active');
    login.classList.remove('modal-active');
  }

  logInPage() {
    const register = document.querySelector('.register-modal') as HTMLElement;
    const login = document.querySelector('.login-modal') as HTMLElement;
    register.classList.remove('modal-active');
    login.classList.add('modal-active');
  }

  closeModal() {
    const modalBg = document.querySelector('.auth-modal-bg') as HTMLElement;
    const registerBlock = document.querySelector('.register-modal') as HTMLElement;
    const loginBlock = document.querySelector('.login-modal') as HTMLElement;
    modalBg.classList.remove('black-bg');
    loginBlock.classList.remove('modal-active');
    registerBlock.classList.remove('modal-active');
    document.body.classList.remove('body-act');

    const textbookController = new TextbookController();
    (async () => {
      await textbookController.rerenderWords('words');
      await textbookController.updateDifficultAndSettingsButtons();
    })().catch((err: Error) => console.warn(err.message));
  }

  checkInput(elem: HTMLElement) {
    const inp = elem as HTMLInputElement;
    inp.addEventListener('input', () => {
      if (inp.id === 'login-password') {
        this.checkLength(inp, 'password');
      } else if (inp.id === 'login-email') {
        this.emailValid(inp);
      } else if (inp.id === 'register-email') {
        this.emailValid(inp);
      } else if (inp.id === 'register-password') {
        this.checkLength(inp, 'password');
      } else if (inp.id === 'register-name') {
        this.checkLength(inp, 'name');
      }
    });
  }

  checkLength(input: HTMLInputElement, str: string) {
    if (str === 'name' && input.value.length === 0) {
      input.style.borderColor = 'red';
    } else if (str === 'password' && input.value.length <= 7) {
      input.style.borderColor = 'red';
    } else {
      input.style.borderColor = 'green';
    }
  }

  emailValid(elem: HTMLElement) {
    const EMAIL_REGEXP =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    const input = elem as HTMLInputElement;

    const isEmailValid = (value: string) => {
      return EMAIL_REGEXP.test(value);
    };

    function onInput() {
      if (isEmailValid(input.value)) {
        input.style.borderColor = 'green';
      } else {
        input.style.borderColor = 'red';
      }
    }
    input.addEventListener('input', onInput);
  }

  async checkRegisterBtn(elem: HTMLElement) {
    const model = new Model();
    const alertPlaceholder = document.querySelector('#error-alert2') as HTMLElement;
    const password = document.querySelector('#register-password') as HTMLInputElement;
    const email = document.querySelector('#register-email') as HTMLInputElement;
    const name = document.querySelector('#register-name') as HTMLInputElement;
    const obj = { email: email.value, password: password.value, name: name.value };
    if (this.EMAIL_REGEXP.test(obj.email) && obj.password.length >= 8 && obj.name.length >= 1) {
      const statusNumber = await model.createUser(obj);
      switch (statusNumber) {
        case Result.success:
          await this.model.signIn({ email: obj.email, password: obj.password });
          elem.innerHTML = 'Log out';
          this.closeModal();
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
    } else if (alertPlaceholder.children.length === 0) {
      AuthController.alert2(alertPlaceholder, 'wrong name, email or password', 'danger');
      setTimeout(() => {
        alertPlaceholder.children[0].remove();
      }, 2000);
    } else {
      alertPlaceholder.children[0].remove();
    }
  }

  async checkLoginBtn(elem: HTMLElement) {
    const alertPlaceholder = document.querySelector('#error-alert') as HTMLElement;
    const password = document.querySelector('#login-password') as HTMLInputElement;
    const email = document.querySelector('#login-email') as HTMLInputElement;
    const obj = { email: email.value, password: password.value };
    if (this.EMAIL_REGEXP.test(obj.email) && obj.password.length >= 8) {
      const resStatus = await this.model.signIn(obj);
      if (resStatus === 200) {
        console.log(elem);

        elem.innerHTML = 'Log out';
        this.closeModal();
      } else if (alertPlaceholder.children.length === 0) {
        AuthController.alert2(alertPlaceholder, 'Account not found', 'danger');
        setTimeout(() => {
          alertPlaceholder.children[0].remove();
        }, 2000);
      } else {
        alertPlaceholder.children[0].remove();
      }
    } else if (alertPlaceholder.children.length === 0) {
      AuthController.alert2(alertPlaceholder, 'Incorrect email or password', 'danger');
      setTimeout(() => {
        alertPlaceholder.children[0].remove();
      }, 2000);
    } else {
      alertPlaceholder.children[0].remove();
    }
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
}
export default AuthController;
