import Page from '../../core/templates/page';

class SignUpPage extends Page {
  static TextObject = {
    MainTitle: 'SignUp Page',
  };

  render() {
    const title = this.createHeaderTitle(SignUpPage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}

export default SignUpPage;
