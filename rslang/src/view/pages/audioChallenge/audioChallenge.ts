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

  async createData(group: number, pageNum?: number, userWords?: IUserWord[] | number | undefined) {
    const gameData: GameData[] = [];
    const page = pageNum || pageNum === 0 ? pageNum : this.random(29);
    const pageWords = await Model.getWords(page, group);
    let words: IWord[] = [];

    const filterWords = (word: IWord) => {
      if (typeof userWords === 'object') {
        const userWord = userWords?.find((uWord) => uWord.wordId === word.id);
        if (userWord) {
          return userWord.difficulty !== 'learned';
        }
      }
      return true;
    };

    if (typeof userWords === 'object') {
      words = pageWords.filter(filterWords);
      if (words.length < 20) {
        let prevWords: IWord[] = [];
        let i = page;
        const promises: Promise<IWord[]>[] = [];
        while (i > 0) {
          i -= 1;
          promises.push(Model.getWords(i, group));
        }
        const promiseResult = await Promise.allSettled(promises);
        promiseResult.forEach((prom) => {
          if (prom.status === 'fulfilled') {
            prevWords = [...prevWords, ...prom.value];
          }
        });
        const nonLearned = prevWords.filter(filterWords);
        words = [...words, ...nonLearned];
        if (words.length > 20) {
          words = words.slice(0, 20);
        }
      }
    } else {
      words = pageWords;
    }

    console.log(words);
    console.log(words.length);
    const newArr: IWord[] = words.sort(() => Math.random() - 0.5);

    newArr.forEach((word) => {
      let variants: IWord[] = [];
      while (variants.length < 4) {
        const index = this.random(pageWords.length - 1);
        const item = pageWords[index];
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
    console.log('ok data');
    console.log(gameData);
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
        if (this.index < this.data.length) {
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
    console.log('ok process game');
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
    const authStr = localStorage.getItem('authDataRSlang');
    let userWords: IUserWord[] | number | undefined;
    if (authStr) {
      userWords = await this.model.getUserWords();
    }
    this.data = await this.createData(group, pageNum, userWords);
    this.imageDiv.className = 'play-image';
    this.text.className = 'play-text';
    this.image.addEventListener('click', () => {
      this.audio.play().catch((err) => console.log(err));
    });
    [this.image, this.text, this.audio].forEach((item) => this.imageDiv.append(item));
    this.gameBody.className = 'game-body';
    this.getProcessGame(userWords);
    console.log('ok start game');
    return this.gameBody;
  }
}
