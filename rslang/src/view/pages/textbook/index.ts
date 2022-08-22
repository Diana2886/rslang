import Model from '../../../model/components/index';
import Page from '../../core/templates/page';

class TextbookPage extends Page {
  model = new Model();

  static TextObject = {
    MainTitle: 'Textbook Page',
  };

  async renderWord(page: number, group: number) {
    // const PAGES_AMOUNT = 30;
    // const GROUPS_AMOUNT = 6;
    const WORDS_AMOUNT = 20;
    const words = await this.model.getWords(page, group);
    console.log(words[0]);
    for (let i = 0; i < WORDS_AMOUNT; i += 1) {
      const wordContainer = document.createElement('div');
      wordContainer.classList.add('word__container');
      const template = `
        <div class="word__img">${words[i].image}</div>
        <div class="word__content">
          <div class="word__wrapper">
            <h3 class="word">${words[i].word}</h3>
            <h4 class="transcription">${words[i].transcription}</h4>
            <span class="sound"></span>
          </div>
          <p class="translation">${words[i].wordTranslate}</p>
          <p class="phrase phrase-en_meaning">${words[i].textMeaning}</p>
          <p class="phrase phrase-ru_meaning">${words[i].textMeaningTranslate}</p>
          <p class="phrase phrase-en_example">${words[i].textExample}</p>
          <p class="phrase phrase-ru_example">${words[i].textExampleTranslate}</p>
        </div>
      `;
      wordContainer.innerHTML = template;
      this.container.append(wordContainer);
    }
  }

  render() {
    (async () => {
      await this.renderWord(1, 2);
    })().catch((err: Error) => console.warn(err.message));
    // const title = this.createHeaderTitle(TextbookPage.TextObject.MainTitle);
    // this.container.append(title);
    return this.container;
  }
}

export default TextbookPage;
