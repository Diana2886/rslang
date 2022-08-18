import Page from '../../core/templates/page';

class LogInPage extends Page {
  static TextObject = {
    MainTitle: 'LogIn Page',
  };

  render() {
    const title = this.createHeaderTitle(LogInPage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}

export default LogInPage;
