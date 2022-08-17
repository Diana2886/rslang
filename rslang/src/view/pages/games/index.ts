import Page from '../../core/templates/page';

class GamesPage extends Page {
  static TextObject = {
    MainTitle: 'Games Page',
  };

  render() {
    const title = this.createHeaderTitle(GamesPage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}

export default GamesPage;
