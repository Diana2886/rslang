import Model, { Result } from '../../model/components/index';
import { IEmpyObj, ISignIn, IUser } from '../../types/index';
import App from '../../view/pages/app/index';

class AuthController {
  userRegistrInfo: IEmpyObj;

  userLogin: ISignIn;

  model: Model;

  form: HTMLFormElement;

  constructor() {
    this.model = new Model();
    this.userRegistrInfo = {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.userLogin = JSON.parse(localStorage.getItem('sthmPasMail')!);
    this.form = document.querySelector('.form') as HTMLFormElement;
  }

  checkRegister(registerBtn: HTMLElement, loginBtn: HTMLButtonElement) {
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
          // new App().run();
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
  }

  checkLogin(registerBtn: HTMLButtonElement, loginBtn: HTMLElement) {
    const form = document.querySelector('.form') as HTMLElement;
    // console.log(form);
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
      // new App().run();
      target.reset();
    });
  }
}
export default AuthController;
