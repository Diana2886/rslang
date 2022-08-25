import ApiModel, { baseURL } from '../model/components/index';
import TextbookModel from '../model/textbookModel';
import PageIds from '../view/pages/app/pageIds';
import TextbookPage from '../view/pages/textbook/index';

class TextbookController {
  textbookPage = new TextbookPage(PageIds.Textbook);

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
          const words = await ApiModel.getWords(TextbookModel.page, TextbookModel.group);
          words.forEach((item) => {
            const audios = [
              `${baseURL}/${item.audio}`,
              `${baseURL}/${item.audioMeaning}`,
              `${baseURL}/${item.audioExample}`,
            ];
            if (item.id === target.id) {
              // console.log(target.id, item.id);
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
        (document.querySelector('.levels-btn') as HTMLButtonElement).innerHTML = target.innerHTML;
        TextbookModel.group = +target.id.split('level')[1] - 1;
        TextbookModel.page = 0;
        (document.querySelector('.pages-btn') as HTMLButtonElement).innerHTML = `Page ${TextbookModel.page + 1}`;
        this.rerenderWords();
      }
    });
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
      }
      if (target.closest('.page-prev')) {
        if (TextbookModel.page > 0) TextbookModel.page -= 1;
        pagesButton.innerHTML = `Page ${TextbookModel.page + 1}`;
        this.rerenderWords();
      }
      if (target.closest('.page-next')) {
        const PAGES_AMOUNT = 30;
        if (TextbookModel.page < PAGES_AMOUNT) TextbookModel.page += 1;
        pagesButton.innerHTML = `Page ${TextbookModel.page + 1}`;
        this.rerenderWords();
      }
    });
  }
}

export default TextbookController;
