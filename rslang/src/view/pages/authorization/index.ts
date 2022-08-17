import Page from '../../core/templates/page';

class AuthorizationPage extends Page {
  static TextObject = {
    MainTitle: 'Authorization Page',
  };

  render() {
    const title = this.createHeaderTitle(AuthorizationPage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}

export default AuthorizationPage;
