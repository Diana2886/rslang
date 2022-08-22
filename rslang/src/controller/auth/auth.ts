import Model, { Result } from '../../model/components/index';
import { IEmpyObj, ISignIn, IUser } from '../../types/index';
import AppView from '../../view/pages/app/index';
import PageIds from '../../view/pages/app/pageIds';

class AuthController {
  userRegistrInfo: IEmpyObj;

  userLogin: ISignIn;

  model: Model;

  constructor() {
    this.model = new Model();
    this.userRegistrInfo = {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.userLogin = JSON.parse(localStorage.getItem('sthmPasMail')!);
  }

  checkElem() {
    const container = document.querySelector('.container') as HTMLElement;
    container.addEventListener('click', (e) => {
      const targ = e.target as HTMLElement;
      if (targ.classList.contains(PageIds.SignUp)) {
        const loginBtn = document.querySelector(`.${PageIds.LogIn}`) as HTMLButtonElement;
        this.checkRegister(targ, loginBtn);
      } else if (targ.classList.contains(PageIds.LogIn)) {
        const registerBtn = document.querySelector(`.${PageIds.SignUp}`) as HTMLButtonElement;
        this.checkLogin(registerBtn, targ);
      }
    });
  }

  checkRegister(registerBtn: HTMLElement, loginBtn: HTMLButtonElement) {
    setTimeout(() => {
      const form = document.querySelector('.form') as HTMLElement;
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const name = (target[0] as HTMLInputElement).value.toString();
        const email = (target[1] as HTMLInputElement).value.toString();
        const password = (target[2] as HTMLInputElement).value.toString();
        this.userRegistrInfo = { name, email, password };
        this.userLogin = { email, password };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const user: IUser = JSON.parse(JSON.stringify(this.userRegistrInfo));
        const status = await this.model.createUser(user);
        switch (status) {
          case Result.success:
            await this.model.signIn(this.userLogin);
            registerBtn.style.display = 'none';
            loginBtn.textContent = 'Log Out';
            // new AppView().render();
            break;
          case Result.exist_email:
            alert('exist e-mail');
            break;
          case Result.wrong_email_password:
            alert('wrong email or password');
            break;
          default:
            break;
        }
        target.reset();
      });
    }, 10);
  }

  checkLogin(registerBtn: HTMLButtonElement, loginBtn: HTMLElement) {
    setTimeout(() => {
      const form = document.querySelector('.form') as HTMLElement;
      console.log(form);
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const target = e.target as HTMLFormElement;
        const email = (target[0] as HTMLInputElement).value.toString();
        const password = (target[1] as HTMLInputElement).value.toString();
        const obj: ISignIn = { email, password };

        await this.model.signIn(obj);
        registerBtn.style.display = 'none';
        loginBtn.textContent = 'Log Out';
        // new AppView().render();
        target.reset();
      });
    }, 10);
  }
}
export default AuthController;
