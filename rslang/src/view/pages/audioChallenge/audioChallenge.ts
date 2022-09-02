import Statistic from '../../../controller/statistics/index';
import Model from '../../../model/components/index';
import { GameData, IUserWord, IWord } from '../../../types/index';
import AudioResult from './results';

export default class AudioGame {
  model: Model;

  stat: Statistic;

  result: AudioResult;

  data: GameData[];

  gameBody: HTMLDivElement;

  imageDiv: HTMLDivElement;

  text: HTMLDivElement;

  audio: HTMLAudioElement;

  signal: HTMLAudioElement;

  image: HTMLImageElement;

  corrects: IWord[];

  wrongs: IWord[];

  index: number;

  constructor(model: Model) {
    this.model = model;
    this.stat = new Statistic();
    this.corrects = [];
    this.wrongs = [];
    this.data = [];
    this.gameBody = document.createElement('div');
    this.imageDiv = document.createElement('div');
    this.image = document.createElement('img');
    this.text = document.createElement('div');
    this.audio = document.createElement('audio');
    this.signal = new Audio(undefined);
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
    if (!(pageNum === undefined)) {
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
    return gameData;
  }

  getProcessGame = (userWords?: IUserWord[] | number) => {
    this.audio.src = '';
    this.imageDiv.classList.remove('showed');
    const icon = document.createElement('img');
    icon.className = 'cassette-icon';
    icon.src = 'assets/svg/compact-cassette.svg';
    this.imageDiv.append(icon);
    this.text.textContent = '';
    const example = this.data[this.index];
    this.image.className = 'cassette-big';
    this.image.src = 'assets/svg/compact-cassette.svg';
    this.audio.src = `http://localhost:3000/${example.word.audio}`;
    this.audio.autoplay = true;
    this.signal.volume = 0.3;
    const variantsBtns = document.createElement('div');
    variantsBtns.className = 'variants__btns';
    const nextBtn = document.createElement('button');
    const signalDiv = this.initSounds();
    nextBtn.className = 'audio-call__next btn btn-info';
    nextBtn.innerHTML = `Next  <kbd>↵</kbd>`;
    nextBtn.disabled = false;
    example.variants.forEach((item, index) => {
      const btnDiv = document.createElement('button');
      btnDiv.className = 'audio-call__choose-btn';
      btnDiv.type = 'button';
      btnDiv.innerHTML = `<kbd>${index + 1}</kbd> ${item.wordTranslate}`;
      btnDiv.addEventListener(
        'click',
        () => {
          const btns = variantsBtns.querySelectorAll('button');
          btns.forEach((button) => {
            button.disabled = true;
          });
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
          this.signal.src = answers ? 'assets/audio/correct.mp3' : 'assets/audio/wrong.mp3';
          this.signal.play().catch((err) => console.log(err));
          if (typeof userWords === 'object') {
            this.stat.writeWordStat('audio', example.word, answers).catch((err) => console.error(err));
          }
          this.image.src = `http://localhost:3000/${example.word.image}`;
          this.text.innerHTML = `${example.word.word} <p>${example.word.wordTranslate}</p>`;
        },
        { once: true }
      );
      variantsBtns.append(btnDiv);
    });
    variantsBtns.append(signalDiv);
    nextBtn.addEventListener('click', () => {
      nextBtn.disabled = true;
      this.index += 1;
      const buttons = variantsBtns.querySelectorAll('button');
      if (!buttons[0].disabled) {
        buttons.forEach((item) => {
          item.disabled = true;
        });
        nextBtn.classList.add('wrong');
        this.signal.src = 'assets/audio/wrong.mp3';
        this.signal.play().catch((err) => console.log(err));
        this.wrongs.push(example.word);
        if (typeof userWords === 'object') {
          this.stat.writeWordStat('audio', example.word, false).catch((err) => console.error(err));
        }
      }
      if (this.index < this.data.length) {
        setTimeout(() => this.getProcessGame(userWords), 1000);
      } else {
        window.dispatchEvent(new CustomEvent('done'));
        this.index = 0;
      }
    });
    this.initBtnListener();
    this.gameBody.innerHTML = '';
    [this.imageDiv, variantsBtns, nextBtn].forEach((item) => this.gameBody.append(item));
  };

  initBtnListener() {
    window.addEventListener('done', () => {
      this.gameBody.innerHTML = '';
      this.gameBody.append(this.result.drawResult(this.corrects, this.wrongs));
    });
  }

  initSounds() {
    const muteState = localStorage.getItem('muteState');
    if (muteState) {
      this.signal.muted = muteState === 'true';
    }
    const signalDiv = document.createElement('div');
    const signalIcon = document.createElement('img');
    signalDiv.className = 'audio-call__signal';
    signalIcon.className = this.signal.muted ? 'signal' : 'mute';
    signalIcon.src = this.signal.muted ? 'assets/svg/volume-xmark.svg' : 'assets/svg/volume-high.svg';
    signalDiv.append(signalIcon);
    signalIcon.addEventListener('click', (e) => {
      const element = <HTMLElement>e.target;
      if (element.classList.contains('mute')) {
        this.signal.muted = true;
        signalIcon.src = 'assets/svg/volume-xmark.svg';
        signalIcon.classList.remove('mute');
      } else {
        this.signal.muted = false;
        signalIcon.classList.add('mute');
        signalIcon.src = 'assets/svg/volume-high.svg';
      }
      localStorage.setItem('muteState', String(this.signal.muted));
    });
    return signalDiv;
  }

  async startGame(group: number, pageNum?: number) {
    this.corrects = [];
    this.wrongs = [];
    this.audio.src = '';
    const authStr = localStorage.getItem('authDataRSlang');
    let userWords: IUserWord[] | number | undefined;
    if (authStr) {
      userWords = await this.model.getUserWords();
    }
    this.data = await this.createData(group, pageNum, userWords);
    this.imageDiv.className = 'play-image';
    this.text.className = 'play-text';
    this.imageDiv.addEventListener('click', () => {
      this.audio.play().catch((err) => console.log(err));
    });
    [this.image, this.text, this.audio].forEach((item) => this.imageDiv.append(item));
    this.gameBody.className = 'game-body';
    this.getProcessGame(userWords);
    return this.gameBody;
  }
}
