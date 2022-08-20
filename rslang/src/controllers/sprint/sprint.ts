import Model from '../../model/components/index';
import { IWord } from '../../types/index';

export default class SprintController {
  model: Model;

  level: number;

  page: number;

  count: number;

  wordsArray: IWord[];

  constructor() {
    this.model = new Model();
    // this.correctWords = [];
    // this.wrongWords = [];
    this.wordsArray = [];
    this.level = 0;
    this.page = 0;
    this.count = 0;
  }

  checkLevel(elem: HTMLElement) {
    const parent = elem.parentElement;
    const lvl = elem.id;
    this.level = +lvl[lvl.length - 1] - 1;

    parent!.style.display = 'none';
    (<HTMLElement>document.querySelector('.sprint-play-wrapper')).style.display = 'flex';
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.pastWordToPlayGame();
  }

  async pastWordToPlayGame() {
    const correctBtn = document.querySelector('.btn-success') as HTMLButtonElement;
    const wrongtBtn = document.querySelector('.btn-danger') as HTMLButtonElement;
    this.wordsArray = await this.model.getWords(this.page, this.level);
    const taskBlock = document.querySelector('.task-block') as HTMLElement;
    const soundWord = taskBlock.children[0] as HTMLElement;
    const englishWord = taskBlock.children[1] as HTMLElement;
    const russiaWord = taskBlock.children[2] as HTMLElement;
    const len = this.wordsArray.length;

    const nextWord = async () => {
      if (this.count === len) {
        this.count = 0;
        this.page += 1;
        this.wordsArray = await this.model.getWords(this.page, this.level);
      }
      const word = this.wordsArray[this.count];
      this.count += 1;
      englishWord.innerHTML = word.word;
      russiaWord.innerHTML = word.wordTranslate;
    };
    correctBtn.addEventListener('click', nextWord);
    wrongtBtn.addEventListener('click', nextWord);
    // console.log(words);
  }
}
