import TextbookModel from '../../../model/textbookModel';
import ApiModel, { baseURL } from '../../../model/components/index';
import Page from '../../core/templates/page';
import PageIds from '../app/pageIds';
import { levelColors, Levels } from '../../../types/index';
import Footer from '../../core/components/footer/index';

class TextbookPage extends Page {
  static TextObject = {
    MainTitle: 'Textbook',
  };

  async renderWords(page: number, group: number) {
    const wordsContainer = document.createElement('div');
    wordsContainer.classList.add('words__container');
    const wordsWrapper = document.createElement('div');
    wordsWrapper.classList.add('words__wrapper');
    const WORDS_AMOUNT = 20;
    const words = await ApiModel.getWords(page, group);
    for (let i = 0; i < WORDS_AMOUNT; i += 1) {
      const imgPath = `${baseURL}/${words[i].image}`;
      const wordContainer = document.createElement('div');
      wordContainer.classList.add('word__container');
      const template = `
        <img class="word__img" src="${imgPath}" alt="image">
        <div class="word__content">
          <div class="word-translation__wrapper" style="border-left: 3px solid ${
            levelColors[Levels[TextbookModel.group]]
          }">
            <div class="word__wrapper">
              <h4 class="word">${words[i].word}</h4>
              <h5 class="transcription">${words[i].transcription}</h5>
              <span class="word__play" id="${words[i].id}"></span>
            </div>
            <p class="translation">${words[i].wordTranslate}</p>
          </div>
          <p class="phrase phrase-en_meaning">${words[i].textMeaning}</p>
          <p class="phrase phrase-ru_meaning">${words[i].textMeaningTranslate}</p>
          <p class="phrase phrase-en_example">${words[i].textExample}</p>
          <p class="phrase phrase-ru_example">${words[i].textExampleTranslate}</p>
        </div>
      `;
      wordContainer.innerHTML = template;
      wordsContainer.append(wordContainer);
    }
    wordsWrapper.append(wordsContainer);
    const footer = new Footer();
    this.container.append(wordsWrapper, footer.renderFooter());
    return wordsContainer;
  }

  renderLevelsElement() {
    const GROUPS_AMOUNT = 6;
    const levelsElement = document.createElement('div');
    levelsElement.classList.add('dropdown', 'levels__dropdown');
    let template = `
      <button class="btn btn-secondary dropdown-toggle dropdown-groups levels-btn" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
        Level ${Levels[TextbookModel.group]}
      </button>
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenu2">
    `;
    for (let i = 0; i < GROUPS_AMOUNT; i += 1) {
      template += `
        <li><button class="dropdown-item level__item" id="level${i + 1}" type="button" style="background-color:${
        levelColors[Levels[i]]
      }">${Levels[i]}</button></li>
      `;
    }
    template += '</ul>';
    levelsElement.innerHTML = template;
    return levelsElement;
  }

  renderPaginationElement() {
    const PAGES_AMOUNT = 30;
    const paginationElement = document.createElement('div');
    paginationElement.classList.add('pagination');
    let template = `
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item">
            <button class="page-link page-prev" type="button" aria-label="Previous">
              <span aria-hidden="true">&lt;</span>
            </button>
          </li>
          <li class="page-item"><button class="btn btn-secondary dropdown-toggle dropdown-groups pages-btn" type="button" id="dropdownMenu3" data-bs-toggle="dropdown" aria-expanded="false">
            Page ${TextbookModel.page + 1}
          </button>
          <ul class="dropdown-menu dropdown-pages dropdown-menu-end" aria-labelledby="dropdownMenu2">
    `;
    for (let i = 0; i < PAGES_AMOUNT; i += 1) {
      template += `
        <li><button class="dropdown-item page__item page${i + 1}" id="page${i + 1}" type="button">Page ${
        i + 1
      }</button></li>
      `;
    }
    template += `
          </ul>
          <li class="page-item">
            <button class="page-link page-next" type="button" aria-label="Next">
              <span aria-hidden="true">&gt;</span>
            </button>
          </li>
        </ul>
      </nav>
    `;
    paginationElement.innerHTML = template;
    return paginationElement;
  }

  renderGamesButton() {
    const template = `
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Games
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li><a class="dropdown-item" href="#${PageIds.AudioChallenge}">Audio Challenge</a></li>
        <li><a class="dropdown-item" href="#${PageIds.Sprint}">Sprint</a></li>
      </ul>
    `;
    const gamesDropdown = document.createElement('div');
    gamesDropdown.classList.add('dropdown', 'textbook-tools__games');
    gamesDropdown.innerHTML = template;
    return gamesDropdown;
  }

  renderTextbookToolsContainer() {
    const textbookToolsContainer = document.createElement('div');
    textbookToolsContainer.classList.add('textbook-tools__container');
    textbookToolsContainer.append(this.renderLevelsElement(), this.renderPaginationElement(), this.renderGamesButton());
    return textbookToolsContainer;
  }

  renderTextbookContainer() {
    const textbookContainer = document.createElement('div');
    textbookContainer.classList.add('textbook__container');
    const title = this.createHeaderTitle(TextbookPage.TextObject.MainTitle);
    textbookContainer.append(title, this.renderTextbookToolsContainer());
    return textbookContainer;
  }

  render() {
    this.container.append(this.renderTextbookContainer());
    (async () => {
      await this.renderWords(TextbookModel.page, TextbookModel.group);
    })().catch((err: Error) => console.warn(err.message));
    return this.container;
  }
}

export default TextbookPage;
