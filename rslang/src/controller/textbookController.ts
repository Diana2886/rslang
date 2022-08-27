import Model, { baseURL } from '../model/components/index';
import TextbookModel from '../model/textbookModel';
import { difficultyColors } from '../types/index';
import PageIds from '../view/pages/app/pageIds';
import TextbookPage from '../view/pages/textbook/index';

class TextbookController {
  textbookPage = new TextbookPage(PageIds.Textbook);

  model = new Model();

  textbookModel = new TextbookModel();

  listenPlayWordButton() {
    document.body.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
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
      if (target.classList.contains('word__play')) {
        console.log(target.id);
        (async () => {
          const words = await Model.getWords(TextbookModel.page, TextbookModel.group);
          words.forEach((item) => {
            const audios = [
              `${baseURL}/${item.audio}`,
              `${baseURL}/${item.audioMeaning}`,
              `${baseURL}/${item.audioExample}`,
            ];
            if (item.id === target.id) {
              audioPlay(audios);
            }
          });
        })().catch((err: Error) => console.warn(err.message));
      }
    });
  }

  rerenderWords() {
    const wordsWrapper = document.querySelector('.words__wrapper') as HTMLElement;
    wordsWrapper.innerHTML = '';
    const textbookPage = new TextbookPage(PageIds.Textbook);
    (async () => {
      wordsWrapper.append(await textbookPage.renderWords(TextbookModel.page, TextbookModel.group));
    })().catch((err: Error) => console.warn(err.message));
  }

  listenLevelButton() {
    document.body.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('level__item')) {
        (document.querySelector('.levels-btn') as HTMLButtonElement).innerHTML = `Level ${target.innerHTML}`;
        TextbookModel.group = +target.id.split('level')[1] - 1;
        TextbookModel.page = 0;
        (document.querySelector('.pages-btn') as HTMLButtonElement).innerHTML = `Page ${TextbookModel.page + 1}`;
        this.rerenderWords();
        (async () => {
          await this.textbookModel.checkPageForPickedWords();
        })().catch((err: Error) => console.warn(err.message));
      }
    });
  }

  checkPageStyle() {
    (async () => {
      await this.textbookModel.checkPageForPickedWords();
    })().catch((err: Error) => console.warn(err.message));
  }

  listenPageButton() {
    document.body.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const pagesButton = document.querySelector('.pages-btn') as HTMLButtonElement;
      if (target.classList.contains('page__item')) {
        pagesButton.innerHTML = target.innerHTML;
        TextbookModel.page = +target.id.split('page')[1] - 1;
        const wordsWrapper = document.querySelector('.words__wrapper') as HTMLElement;
        wordsWrapper.innerHTML = '';
        const textbookPage = new TextbookPage(PageIds.Textbook);
        (async () => {
          wordsWrapper.append(await textbookPage.renderWords(TextbookModel.page, TextbookModel.group));
        })().catch((err: Error) => console.warn(err.message));
        this.checkPageStyle();
      }
      if (target.closest('.page-prev')) {
        if (TextbookModel.page > 0) TextbookModel.page -= 1;
        pagesButton.innerHTML = `Page ${TextbookModel.page + 1}`;
        this.rerenderWords();
        this.checkPageStyle();
      }
      if (target.closest('.page-next')) {
        const PAGES_AMOUNT = 30;
        if (TextbookModel.page < PAGES_AMOUNT) TextbookModel.page += 1;
        pagesButton.innerHTML = `Page ${TextbookModel.page + 1}`;
        this.rerenderWords();
        this.checkPageStyle();
      }
    });
  }

  listenWordButtons() {
    document.body.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const wordContainer = target.closest('.word__container') as HTMLElement;
      const wordButtons = ['difficult', 'learned'];
      wordButtons.forEach((item) => {
        if (target.classList.contains(`${item}-button`)) {
          wordContainer.style.backgroundColor = difficultyColors[item];
          const wordId = wordContainer.id.split('word-id-')[1];
          (async () => {
            const userWord = await this.model.getUserWord(wordId);
            if (typeof userWord === 'number') {
              await this.model.createUserWord(wordId, { difficulty: item });
              await this.textbookModel.checkPageForPickedWords();
            } else if (userWord.difficulty !== item) {
              await this.model.updateUserWord(wordId, { difficulty: item });
            }
          })().catch((err: Error) => console.warn(err.message));
        }
      });
    });
  }
}

export default TextbookController;
