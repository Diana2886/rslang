import Page from '../../core/templates/page';

class TextbookPage extends Page {
  static TextObject = {
    MainTitle: 'Textbook Page',
  };

  render() {
    const title = this.createHeaderTitle(TextbookPage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}

export default TextbookPage;
