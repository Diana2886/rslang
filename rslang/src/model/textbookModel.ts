/* eslint-disable no-underscore-dangle */
import { ISettings, IUserWord, IWord } from '../types/index';
import Model, { baseURL } from './components/index';

class TextbookModel {
  static group = Number(localStorage.getItem('group'));

  static page = Number(localStorage.getItem('page'));

  static isDifficultWordsGroup = false;

  static PAGES_AMOUNT = 30;

  static userWords: IUserWord[] | number = [];

  static settings: ISettings = {
    optional: {
      translationCheck: true,
      wordButtonsCheck: true,
    },
  };

  model = new Model();

  checkAuthorization() {
    return Boolean(localStorage.getItem('authDataRSlang'));
  }

  async getUserWords() {
    TextbookModel.userWords = await this.model.getUserWords();
  }

  async getSettings() {
    const settingsApi = await this.model.getSettings();
    if (typeof settingsApi === 'number') {
      TextbookModel.settings.optional = {
        translationCheck: true,
        wordButtonsCheck: true,
      };
    } else TextbookModel.settings.optional = settingsApi.optional;
  }

  playWord(words: IWord[], target: HTMLElement) {
    const audioPlay = (paths: string[]) => {
      const audio = new Audio(paths[0]);
      audio.autoplay = true;
      audio.onended = () => {
        for (let i = 1; i < paths.length; i += 1) {
          paths.shift();
          audioPlay(paths);
        }
      };
    };
    words.forEach((item) => {
      const audios = [`${baseURL}/${item.audio}`, `${baseURL}/${item.audioMeaning}`, `${baseURL}/${item.audioExample}`];
      if (TextbookModel.getWordId(item) === target.id) {
        audioPlay(audios);
      }
    });
  }

  resetPageStyles() {
    const wordsWrapper = document.querySelector('.words__wrapper') as HTMLElement;
    const pagesButton = document.querySelector('.pages-btn') as HTMLElement;
    if (wordsWrapper || pagesButton) {
      wordsWrapper.style.boxShadow = 'none';
      wordsWrapper.style.border = 'inherit';
      pagesButton.style.border = '1px solid #F0C932';
    }
  }

  static setLocalStorageSettings(): void {
    const setLocalStorage = (): void => {
      localStorage.setItem('group', `${TextbookModel.group}`);
      localStorage.setItem('page', `${TextbookModel.page}`);
      localStorage.setItem('difficultWords', String(TextbookModel.isDifficultWordsGroup));
    };
    window.addEventListener('beforeunload', setLocalStorage);

    const getLocalStorage = (): void => {
      if (localStorage.getItem('group')) {
        TextbookModel.group = +(localStorage.getItem('group') as string);
      }
      if (localStorage.getItem('page')) {
        TextbookModel.page = +(localStorage.getItem('page') as string);
      }
      if (localStorage.getItem('difficultWords')) {
        if (localStorage.getItem('difficultWords') === 'false') TextbookModel.isDifficultWordsGroup = false;
        else TextbookModel.isDifficultWordsGroup = Boolean(localStorage.getItem('difficultWords'));
      }
    };
    window.addEventListener('DOMContentLoaded', getLocalStorage);
  }

  async getDifficultWords() {
    if (this.checkAuthorization()) {
      let wordsCount = 0;
      if (typeof TextbookModel.userWords === 'object') {
        const difficultWords = TextbookModel.userWords.filter((word) => word.difficulty === 'difficult');
        wordsCount = difficultWords.length;
      }
      const difficultWordsRes = await this.model.getAggregatedWords(
        '{"userWord.difficulty":"difficult"}',
        undefined,
        0,
        wordsCount
      );
      let difficultWords: IWord[] = [];
      if (typeof difficultWordsRes === 'object') {
        difficultWords = difficultWordsRes[0].paginatedResults;
      }
      return difficultWords;
    }
    return [];
  }

  setDifficultWordsPage() {
    TextbookModel.isDifficultWordsGroup = true;
    const levelButton = document.querySelector('.levels-btn') as HTMLElement;
    levelButton.innerHTML = 'Level';
    this.controlPageButtonsAccess(true);
    this.controlGamesButtonAccess();
    const wordsWrapper = document.querySelector('.words__wrapper') as HTMLElement;
    if (this.checkAuthorization()) {
      wordsWrapper.style.border = '3px solid #545BE850';
      wordsWrapper.style.boxShadow = '0px 0px 8px rgba(0, 0, 0, 0.1)';
    } else wordsWrapper.innerText = 'Please select a level or sign in!';
  }

  async checkPageStyle() {
    let count = 0;
    const words = await Model.getWords(TextbookModel.page, TextbookModel.group);
    if (this.checkAuthorization()) {
      words.forEach((word) => {
        if (typeof TextbookModel.userWords === 'object') {
          TextbookModel.userWords.forEach((item) => {
            if (word.id === item.wordId && item.difficulty === 'learned') count += 1;
          });
        }
      });
      if (!TextbookModel.isDifficultWordsGroup) {
        const wordsWrapper = document.querySelector('.words__wrapper') as HTMLElement;
        const pagesButton = document.querySelector('.pages-btn') as HTMLElement;
        wordsWrapper.style.boxShadow = count === 20 ? '0px 0px 8px rgba(0, 0, 0, 0.1)' : 'none';
        wordsWrapper.style.border = count === 20 ? '3px solid #F0C93250' : 'none';
        pagesButton.style.border = count === 20 ? '1px solid #545BE8' : '1px solid #F0C932';
        const gamesButton = document.querySelector('.textbook-games__button') as HTMLButtonElement;
        gamesButton.disabled = count === 20;
      }
    }
  }

  controlPageButtonsAccess(flag: boolean) {
    const pagePrevButton = document.querySelector('.page-prev') as HTMLButtonElement;
    const pageNextButton = document.querySelector('.page-next') as HTMLButtonElement;
    const pagesButton = document.querySelector('.pages-btn') as HTMLButtonElement;
    if (flag) pagesButton.innerHTML = 'Page';
    const pageButtons = [pagePrevButton, pagesButton, pageNextButton];
    pageButtons.forEach((item) => {
      item.disabled = flag;
    });
  }

  updatePaginationState() {
    const prevButton = document.querySelector('.page-prev') as HTMLButtonElement;
    const nextButton = document.querySelector('.page-next') as HTMLButtonElement;
    prevButton.disabled = !(TextbookModel.page > 0);
    nextButton.disabled = !(TextbookModel.page < TextbookModel.PAGES_AMOUNT - 1);
  }

  controlGamesButtonAccess() {
    const gamesButton = document.querySelector('.textbook-games__button') as HTMLButtonElement;
    gamesButton.disabled = TextbookModel.isDifficultWordsGroup;
  }

  static getWordId(word: IWord) {
    if (!word.id) {
      if (word._id) {
        return word._id;
      }
    }
    return word.id;
  }

  isUserWordExist(id: string) {
    if (this.checkAuthorization()) {
      if (typeof TextbookModel.userWords === 'object') {
        let count = 0;
        TextbookModel.userWords.forEach((word) => {
          if (word.wordId !== id) count += 1;
        });
        if (count !== TextbookModel.userWords.length) {
          return true;
        }
      }
    }
    return false;
  }

  async getStatisticsForTextbookWord(id: string) {
    let allGames = 0;
    let correctAnswers = 0;
    if (this.checkAuthorization() && this.isUserWordExist(id)) {
      const userWord = await this.model.getUserWord(id);
      if (typeof userWord === 'object' && userWord.optional) {
        const { audio, sprint } = userWord.optional;
        const values = [...Object.values(audio), ...Object.values(sprint)];
        values.forEach((item) => {
          allGames += item.allGames;
          correctAnswers += item.corrects;
        });
      }
    }
    return { allGames, correctAnswers };
  }
}

export default TextbookModel;
