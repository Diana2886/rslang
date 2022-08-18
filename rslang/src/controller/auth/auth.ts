class AuthController {
  checkForm() {
    console.log(document.body);
    const signin = document.querySelector('#signin');
    const curPage = document.querySelector('#current-page');

    console.log('signin', signin);
    console.log('cur-page', curPage);
  }
}
export default AuthController;
