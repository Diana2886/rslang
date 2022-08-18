import Page from '../../core/templates/page';

class RegisterPage extends Page {
  static TextObject = {
    MainTitle: 'Register Page',
  };

  render() {
    const title = this.createHeaderTitle(RegisterPage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}

export default RegisterPage;
