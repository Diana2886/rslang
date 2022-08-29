import AudioStatistic from '../../../controller/audio/statistics';
import Model from '../../../model/components/index';
import { GameData, IUserWord, IWord } from '../../../types/index';
import AudioResult from './results';

export default class AudioGame {
  model: Model;

  stat: AudioStatistic;

  result: AudioResult;

  data: GameData[];

  gameBody: HTMLDivElement;

  imageDiv: HTMLDivElement;

  text: HTMLDivElement;

  audio: HTMLAudioElement;

  image: HTMLImageElement;

  corrects: IWord[];

  wrongs: IWord[];

  index: number;

  constructor(model: Model) {
    this.model = model;
    this.stat = new AudioStatistic();
    this.corrects = [];
    this.wrongs = [];
    this.data = [];
    this.gameBody = document.createElement('div');
    this.imageDiv = document.createElement('div');
    this.image = document.createElement('img');
    this.text = document.createElement('div');
    this.audio = document.createElement('audio');
    this.index = 0;
    this.result = new AudioResult();
  }

  private random = (max: number) => Math.floor(Math.random() * max) + 1;

  async createData(group: number, pageNum?: number) {
    const gameData: GameData[] = [];
    const page = pageNum || pageNum === 0 ? pageNum : this.random(29);
    const words = await Model.getWords(page, group);
    const newArr: IWord[] = words.sort(() => Math.random() - 0.5);
    newArr.forEach((word) => {
      let variants: IWord[] = [];
      while (variants.length < 4) {
        const index = this.random(19);
        const item = words[index];
        variants.push(item);
        variants = variants.filter((element) => element.word !== word.word);
        variants = [...new Set(variants)];
      }
      const i = this.random(4);
      variants.splice(i, 0, word);
      gameData.push({
        word,
        variants,
      });
    });
    return gameData;
  }

  getProcessGame = (userWords?: IUserWord[] | number) => {
    this.imageDiv.classList.remove('showed');
    this.text.textContent = '';
    const example = this.data[this.index];
    console.log(example);
    this.image.src = 'assets/svg/compact-cassette.svg';
    this.audio.src = `http://localhost:3000/${example.word.audio}`;
    this.audio.autoplay = true;
    const variantsBtns = document.createElement('div');
    variantsBtns.className = 'variants__btns';
    example.variants.forEach((item, index) => {
      const btnDiv = document.createElement('button');
      btnDiv.className = 'audio-call__choose-btn';
      btnDiv.type = 'button';
      btnDiv.textContent = `${index + 1} ${item.wordTranslate}`;
      btnDiv.addEventListener('click', () => {
        variantsBtns.classList.add('disabled');
        this.imageDiv.classList.add('showed');
        let answers = false;
        if (btnDiv.textContent === `${index + 1} ${example.word.wordTranslate}`) {
          btnDiv.classList.add('correct');
          answers = true;
          this.corrects.push(example.word);
        } else {
          btnDiv.classList.add('wrong');
          this.wrongs.push(example.word);
        }
        if (typeof userWords === 'object') {
          this.stat.writeWordStat(userWords, example, answers);
        }
        this.image.src = `http://localhost:3000/${example.word.image}`;
        this.text.textContent = example.word.word;
        this.index += 1;
        if (this.index < 20) {
          setTimeout(() => this.getProcessGame(userWords), 2000);
        } else {
          window.dispatchEvent(new CustomEvent('done'));
          this.index = 0;
        }
      });
      variantsBtns.append(btnDiv);
    });
    this.initBtnListener(variantsBtns);
    this.gameBody.innerHTML = '';
    [this.imageDiv, variantsBtns].forEach((item) => this.gameBody.append(item));
  };

  initBtnListener(variantsBtns: HTMLDivElement) {
    window.addEventListener(
      'keyup',
      (e) => {
        const number: number = +e.key;
        if (number > 0 && number < 6) {
          const buttons = variantsBtns.querySelectorAll('button');
          const button = buttons[number - 1];
          button.click();
        }
      },
      { once: true }
    );
    window.addEventListener('done', () => {
      this.gameBody.innerHTML = '';
      this.gameBody.append(this.result.drawResult(this.corrects, this.wrongs));
    });
  }

  async startGame(group: number, pageNum?: number) {
    this.data = await this.createData(group, pageNum);
    this.imageDiv.className = 'play-image';
    this.text.className = 'play-text';
    this.image.addEventListener('click', () => {
      this.audio.play().catch((err) => console.log(err));
    });
    [this.image, this.text, this.audio].forEach((item) => this.imageDiv.append(item));
    this.gameBody.className = 'game-body';
    const authStr = localStorage.getItem('authDataRSlang');
    let userWords: IUserWord[] | number | undefined;
    if (authStr) {
      userWords = await this.model.getUserWords();
    }
    this.getProcessGame(userWords);
    return this.gameBody;
  }
}
