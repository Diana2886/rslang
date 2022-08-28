import Page from '../../core/templates/page';

class DifficultWordsPage extends Page {
  static TextObject = {
    MainTitle: 'Difficult words',
  };

  render() {
    const title = this.createHeaderTitle(DifficultWordsPage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}

export default DifficultWordsPage;
