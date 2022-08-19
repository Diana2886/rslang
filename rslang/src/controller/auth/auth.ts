import Model from '../../model/components/index';
import { IEmpyObj, ISignIn, IUser } from '../../types/index';

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

  checkRegister() {
    const form = document.querySelector('.form') as HTMLElement;
    console.log(form);
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
      await this.model.createUser(user);
      await this.model.signIn(this.userLogin);
      target.reset();
    });
  }

  checkLogin() {
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
      target.reset();
    });
  }
}
export default AuthController;
