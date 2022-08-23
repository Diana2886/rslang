import Model, { baseURL } from '../../../model/components/index';
import Page from '../../core/templates/page';

class TextbookPage extends Page {
  model = new Model();

  static TextObject = {
    MainTitle: 'Textbook Page',
  };

  async renderWords(page: number, group: number) {
    const wordsContainer = document.createElement('div');
    wordsContainer.classList.add('words__container');
    const WORDS_AMOUNT = 20;
    const words = await Model.getWords(page, group);
    console.log(words);
    for (let i = 0; i < WORDS_AMOUNT; i += 1) {
      const imgPath = `${baseURL}/${words[i].image}`;
      const wordContainer = document.createElement('div');
      wordContainer.classList.add('word__container');
      const template = `
        <img class="word__img" src="${imgPath}" alt="image">
        <div class="word__content">
          <div class="word__wrapper">
            <h4 class="word">${words[i].word}</h4>
            <h5 class="transcription">${words[i].transcription}</h5>
            <span class="word__play" id="${words[i].id}"></span>
          </div>
          <p class="translation">${words[i].wordTranslate}</p>
          <p class="phrase phrase-en_meaning">${words[i].textMeaning}</p>
          <p class="phrase phrase-ru_meaning">${words[i].textMeaningTranslate}</p>
          <p class="phrase phrase-en_example">${words[i].textExample}</p>
          <p class="phrase phrase-ru_example">${words[i].textExampleTranslate}</p>
        </div>
      `;
      wordContainer.innerHTML = template;
      wordsContainer.append(wordContainer);
    }
    this.container.append(wordsContainer);
  }

  renderGroupsElement() {
    const GROUPS_AMOUNT = 6;
    const groupsElement = document.createElement('div');
    groupsElement.classList.add('dropdown', 'groups__dropdown');
    let template = `
      <button class="btn btn-secondary dropdown-toggle dropdown-groups" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
        Group 1
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
    `;
    for (let i = 0; i < GROUPS_AMOUNT; i += 1) {
      template += `
        <li><button class="dropdown-item btn${i}" type="button">Group ${i}</button></li>
      `;
    }
    template += '</ul>';
    groupsElement.innerHTML = template;
    return groupsElement;
  }

  renderPaginationElement() {
    const paginationElement = document.createElement('div');
    paginationElement.classList.add('pagination');
    const template = `
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item">
            <button class="page-link" type="button" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          <li class="page-item"><button class="page-link" type="button">1</button></li>
          <li class="page-item"><button class="page-link" type="button">2</button></li>
          <li class="page-item"><button class="page-link" type="button">3</button></li>
          <li class="page-item">
            <button class="page-link" type="button" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    `;
    paginationElement.innerHTML = template;
    return paginationElement;
  }

  renderTextbookToolsContainer() {
    const textbookToolsContainer = document.createElement('div');
    textbookToolsContainer.classList.add('textbook-tools__container');
    /* const template = `
      <div class="btn-group" role="group" aria-label="Basic mixed styles example">
        <button type="button" class="btn btn1">Section 1</button>
        <button type="button" class="btn btn2">Section 2</button>
        <button type="button" class="btn btn3">Section 3</button>
        <button type="button" class="btn btn4">Section 4</button>
        <button type="button" class="btn btn5">Section 5</button>
        <button type="button" class="btn btn6">Section 6</button>
      </div>
    `; */
    textbookToolsContainer.append(this.renderGroupsElement(), this.renderPaginationElement());
    return textbookToolsContainer;
  }

  renderTextbookContainer() {
    // const PAGES_AMOUNT = 30;
    const textbookContainer = document.createElement('div');
    textbookContainer.classList.add('textbook__container');
    textbookContainer.append();
  }

  render() {
    this.container.append(this.renderTextbookToolsContainer());
    (async () => {
      await this.renderWords(0, 0);
    })().catch((err: Error) => console.warn(err.message));
    // const title = this.createHeaderTitle(TextbookPage.TextObject.MainTitle);
    // this.container.append(title);
    return this.container;
  }
}

export default TextbookPage;
