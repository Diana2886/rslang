import Page from '../../core/templates/page';

class WordListPage extends Page {
  static TextObject = {
    MainTitle: 'WordList Page',
  };

  render() {
    const title = this.createHeaderTitle(WordListPage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}

export default WordListPage;
