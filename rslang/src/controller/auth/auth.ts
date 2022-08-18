import Model from '../../model/components/index';

class AuthController {
  checkForm() {
    const form = document.querySelector('.form') as HTMLElement;
    console.log(form);
    // const ff = await createUser(user)
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const target = e.target as HTMLFormElement;
      const name = (target[0] as HTMLInputElement).value.toString();
      const email = (target[1] as HTMLInputElement).value.toString();
      const password = (target[2] as HTMLInputElement).value.toString();
      const obj = { name, email, password };
      const model = new Model();
      const user = await model.createUser(obj);
      target.reset();
      const newUser = JSON.parse(localStorage.getItem('newUserDataRSlang')!);
      console.log(newUser);
    });
  }
}
export default AuthController;
