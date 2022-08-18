import PageIds from '../../pages/app/pageIds';

abstract class Page {
  protected container: HTMLElement;

  static TextObject = {};

  constructor(id: string) {
    this.container = document.createElement('div');
    this.container.id = id;
  }

  protected createHeaderTitle(text: string) {
    const headerTitle = document.createElement('h1');
    headerTitle.classList.add('title', `${this.container.id}__title`);
    headerTitle.innerHTML = text;
    return headerTitle;
  }

  render() {
    return this.container;
  }
}

export default Page;
