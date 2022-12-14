import Model from '../model/components/index';
import TextbookModel from '../model/textbookModel';
import { difficultyColors, IOptional, ISettingsOptional } from '../types/index';
import PageIds from '../view/pages/app/pageIds';
import TextbookPage from '../view/pages/textbook/index';
import Statistic from './statistics/index';

class TextbookController {
  textbookPage = new TextbookPage(PageIds.Textbook);

  model = new Model();

  textbookModel = new TextbookModel();

  listenPlayWordButton() {
    document.body.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('word__play')) {
        this.textbookModel.playWord(
          TextbookModel.isDifficultWordsGroup ? TextbookModel.difficultWords : TextbookModel.words,
          target
        );
      }
    });
  }

  async rerenderWords(wordsType: string) {
    const spinnerBlock = document.createElement('div');
    spinnerBlock.className = 'textbook__spinner-block';
    spinnerBlock.innerHTML = `<div class="d-flex justify-content-center">
    <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
  </div>`;
    this.textbookModel.resetPageStyles();
    const wordsWrapper = document.querySelector('.words__wrapper') as HTMLElement;
    if (wordsWrapper) {
      wordsWrapper.innerHTML = '';
      wordsWrapper.append(spinnerBlock);
      TextbookModel.words = await Model.getWords(TextbookModel.page, TextbookModel.group);
      await this.textbookModel.getDifficultWords();
      if (TextbookModel.isDifficultWordsGroup) await this.textbookModel.setDifficultWordsPage();
      wordsWrapper.innerHTML = '';
      wordsWrapper.append(
        await this.textbookPage.renderWords(wordsType === 'words' ? TextbookModel.words : TextbookModel.difficultWords)
      );
      await this.textbookModel.checkPageStyle();
    }
  }

  async updateDifficultAndSettingsButtons() {
    const textbookToolsAdditionContainer = document.querySelector('.textbook-tools-addition__container') as HTMLElement;
    const difficultWordsButtonContainer = document.querySelector('.difficult-words-button__container');
    const settingsContainer = document.querySelector('.settings__container');
    if (await this.model.checkAuth()) {
      if (!difficultWordsButtonContainer)
        textbookToolsAdditionContainer.append(this.textbookPage.renderDifficultWordsButton());
      if (!settingsContainer) textbookToolsAdditionContainer.append(await this.textbookPage.renderSettingsButton());
      else {
        settingsContainer.remove();
        textbookToolsAdditionContainer.append(await this.textbookPage.renderSettingsButton());
        console.log('new settings button', TextbookModel.settings.optional);
      }
    } else {
      if (difficultWordsButtonContainer) difficultWordsButtonContainer.remove();
      if (settingsContainer) settingsContainer.remove();
    }
  }

  listenLevelButton() {
    document.body.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('level__item')) {
        TextbookModel.isDifficultWordsGroup = false;
        this.textbookModel.controlGamesButtonAccess();
        this.textbookModel.controlPageButtonsAccess(false);
        (document.querySelector('.levels-btn') as HTMLButtonElement).innerHTML = `Level ${target.innerHTML}`;
        TextbookModel.group = +target.id.split('level')[1] - 1;
        TextbookModel.page = 0;
        (document.querySelector('.pages-btn') as HTMLButtonElement).innerHTML = `Page ${TextbookModel.page + 1}`;
        (async () => {
          await this.rerenderWords('words');
          this.textbookModel.resetPageStyles();
          await this.textbookModel.checkPageStyle();
        })().catch((err: Error) => console.warn(err.message));
        this.textbookModel.updatePaginationState();
      }
    });
  }

  listenPageButton() {
    document.body.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const pagesButton = document.querySelector('.pages-btn') as HTMLButtonElement;
      const prevPageButton = document.querySelector('.page-prev') as HTMLButtonElement;
      const nextPageButton = document.querySelector('.page-next') as HTMLButtonElement;
      const disablePrevNextPageButtons = () => {
        prevPageButton.disabled = true;
        nextPageButton.disabled = true;
      };
      const checkPageStyle = () => {
        (async () => {
          await this.textbookModel.checkPageStyle();
        })().catch((err: Error) => console.warn(err.message));
      };
      if (target.classList.contains('page__item')) {
        disablePrevNextPageButtons();
        pagesButton.innerHTML = target.innerHTML;
        TextbookModel.page = +target.id.split('page')[1] - 1;
        (async () => {
          await this.rerenderWords('words');
          this.textbookModel.updatePaginationState();
        })().catch((err: Error) => console.warn(err.message));
        checkPageStyle();
      }
      if (target.closest('.page-prev')) {
        disablePrevNextPageButtons();
        if (TextbookModel.page > 0) TextbookModel.page -= 1;
        pagesButton.innerHTML = `Page ${TextbookModel.page + 1}`;
        (async () => {
          await this.rerenderWords('words');
          this.textbookModel.updatePaginationState();
        })().catch((err: Error) => console.warn(err.message));
        this.textbookModel.resetPageStyles();
        checkPageStyle();
      }
      if (target.closest('.page-next')) {
        disablePrevNextPageButtons();
        if (TextbookModel.page < TextbookModel.PAGES_AMOUNT) TextbookModel.page += 1;
        pagesButton.innerHTML = `Page ${TextbookModel.page + 1}`;
        (async () => {
          await this.rerenderWords('words');
          this.textbookModel.updatePaginationState();
        })().catch((err: Error) => console.warn(err.message));
        this.textbookModel.resetPageStyles();
        checkPageStyle();
      }
    });
  }

  listenDifficultWordsButton() {
    document.body.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('btn-difficult-words')) {
        TextbookModel.isDifficultWordsGroup = true;
        (async () => {
          await this.rerenderWords('difficultWords');
          this.textbookModel.resetPageStyles();
          await this.textbookModel.setDifficultWordsPage();
        })().catch((err: Error) => console.warn(err.message));
      }
    });
  }

  listenWordButtons() {
    document.body.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const wordContainer = target.closest('.word__container') as HTMLElement;
      let cardColor = '';
      if (wordContainer) {
        cardColor = wordContainer.style.backgroundColor;
      }
      const wordButtons = ['difficult', 'learned'];
      const date = new Date();
      const key = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
      const optional: IOptional = {
        audio: {
          [key]: {
            allGames: 0,
            corrects: 0,
          },
        },
        sprint: {
          [key]: {
            allGames: 0,
            corrects: 0,
          },
        },
        serial: 0,
      };
      wordButtons.forEach((item) => {
        if (target.classList.contains(`${item}-button`)) {
          if (target.innerHTML !== 'remove') wordContainer.style.backgroundColor = difficultyColors[item];
          const wordId = wordContainer.id.split('word-id-')[1];
          (async () => {
            if (await this.model.checkAuth()) {
              const userWord = await this.model.getUserWord(wordId);
              const statistics = new Statistic();
              if (typeof userWord === 'number') {
                await this.model.createUserWord(wordId, { difficulty: item, optional });
                if (target.classList.contains('learned-button')) {
                  await statistics.writeGlobalStat('learned', 'textbook', key);
                }
                this.textbookModel.resetPageStyles();
                await this.textbookModel.checkPageStyle();
              } else if (userWord.difficulty !== item) {
                if (target.classList.contains('item')) target.classList.remove(item);
                if (target.classList.contains('learned-button')) {
                  await statistics.writeGlobalStat('learned', 'textbook', key);
                }
                if (target.classList.contains('difficult-button') && cardColor === 'rgb(252, 244, 214)') {
                  await statistics.writeGlobalStat('learned', 'textbook', key, true);
                  if (userWord.optional) {
                    userWord.optional.serial = 0;
                  }
                }
                await this.model.updateUserWord(wordId, { difficulty: item, optional: userWord.optional });
                this.textbookModel.resetPageStyles();
                await this.textbookModel.checkPageStyle();
              } else if (userWord.difficulty === item) {
                if (target.classList.contains(`${item}-button`)) {
                  wordContainer.style.backgroundColor = 'inherit';
                  target.classList.add(item);
                  if (target.classList.contains(item)) {
                    if (target.classList.contains('learned')) {
                      await statistics.writeGlobalStat('learned', 'textbook', key, true);
                      if (userWord.optional) {
                        userWord.optional.serial = 0;
                      }
                    }
                    await this.model.updateUserWord(wordId, { difficulty: 'new', optional: userWord.optional });
                  }
                  this.textbookModel.resetPageStyles();
                  await this.textbookModel.checkPageStyle();
                }
              }
              if (target.classList.contains('difficult-button') && target.innerHTML === 'remove') {
                if (typeof userWord !== 'number' && userWord.optional) {
                  userWord.optional.serial = 0;
                  await this.model.updateUserWord(wordId, { difficulty: 'new', optional: userWord.optional });
                }
                await this.rerenderWords('difficultWords');
              }
            }
          })().catch((err: Error) => console.warn(err.message));
        }
      });
    });
  }

  listenSettingsModalWindow() {
    document.body.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('.form-check')) {
        const settingsCheckboxIds = [
          { translationCheck: ['translation', 'phrase-ru_meaning', 'phrase-ru_example'] },
          { wordButtonsCheck: ['difficult-button', 'learned-button'] },
        ];
        settingsCheckboxIds.forEach((item) => {
          const checkboxItem = document.querySelector(`#${Object.keys(item)[0]}`) as HTMLInputElement;
          const elementsForHiding = Object.values(item)[0] as string[];
          const hideElements = () => {
            elementsForHiding.forEach((el) => {
              const elements = document.querySelectorAll(`.${el}`);
              elements.forEach((element) => {
                (element as HTMLElement).style.display = checkboxItem.checked ? 'block' : 'none';
              });
            });
          };
          const updateSettings = () => {
            (async () => {
              TextbookModel.settings.optional[Object.keys(item)[0] as keyof ISettingsOptional] = checkboxItem.checked;
              await this.model.updateSettings(TextbookModel.settings);
            })().catch((err: Error) => console.warn(err.message));
          };
          checkboxItem.addEventListener('change', hideElements);
          checkboxItem.addEventListener('change', updateSettings);
        });
      }
    });
  }
}

export default TextbookController;
