import Model from './components/index';

class TextbookModel {
  static group = Number(localStorage.getItem('group'));

  static page = Number(localStorage.getItem('page'));

  model = new Model();

  static setLocalStorageSettings(): void {
    const setLocalStorage = (): void => {
      localStorage.setItem('group', `${TextbookModel.group}`);
      localStorage.setItem('page', `${TextbookModel.page}`);
    };
    window.addEventListener('beforeunload', setLocalStorage);

    const getLocalStorage = (): void => {
      if (localStorage.getItem('group')) {
        TextbookModel.group = +(localStorage.getItem('group') as string);
      }
      if (localStorage.getItem('page')) {
        TextbookModel.page = +(localStorage.getItem('page') as string);
      }
    };
    window.addEventListener('DOMContentLoaded', getLocalStorage);
  }

  async checkPageForPickedWords() {
    let count = 0;
    const words = await Model.getWords(TextbookModel.page, TextbookModel.group);
    const userWords = await this.model.getUserWords();
    words.forEach((word) => {
      if (typeof userWords === 'object') {
        userWords.forEach((item) => {
          if (word.id === item.wordId && (item.difficulty === 'learned' || item.difficulty === 'difficult')) count += 1;
        });
      }
    });
    const wordsWrapper = document.querySelector('.words__wrapper') as HTMLElement;
    const pagesButton = document.querySelector('.pages-btn') as HTMLElement;
    wordsWrapper.style.boxShadow = count === 20 ? '0px 0px 8px rgba(0, 0, 0, 0.1)' : 'none';
    wordsWrapper.style.backgroundColor = count === 20 ? '#ffffff' : 'inherit';
    pagesButton.style.border = count === 20 ? '1px solid #393E46' : '1px solid #F0C932';
    const gamesButton = document.querySelector('.textbook-games__button') as HTMLButtonElement;
    gamesButton.disabled = count === 20;
  }
}

export default TextbookModel;
