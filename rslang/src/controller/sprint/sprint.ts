/* eslint-disable no-dupe-else-if */
/* eslint-disable @typescript-eslint/no-misused-promises */
import Model from '../../model/components/index';
import { IUserWord, IWord } from '../../types/index';
import Statistic from '../statistics/index';

const baseUrl = 'http://localhost:3000';

export default class SprintController {
  model: Model;

  level: number;

  page: number;

  count: number;

  len: number;

  wordsArray: IWord[];

  correctWords: IWord[];

  wrongWords: IWord[];

  engWords: IWord[];

  rusWords: IWord[];

  counter: number;

  point: number;

  score: number;

  static: Statistic;

  constructor() {
    this.static = new Statistic();
    this.model = new Model();
    this.correctWords = [];
    this.wrongWords = [];
    this.wordsArray = [];
    this.engWords = [];
    this.rusWords = [];
    this.level = 0;
    this.page = 0;
    this.count = 0;
    this.len = 0;

    this.score = 0;
    this.point = 10;
    this.counter = 0;
  }

  checkSprintElem() {
    const container = document.querySelector('.container') as HTMLElement;
    container.addEventListener('click', async (e) => {
      const targ = e.target as HTMLElement;
      if (targ.classList.contains('btn-check')) {
        await this.checkLevel(targ);
      } else if (targ.classList.contains('start-game')) {
        await this.pastWordToPlayGame(targ);
      } else if (targ.classList.contains('sprint-fuul_screan')) {
        this.fullScreen(targ);
      } else if (targ.classList.contains('repeat-btn')) {
        this.modalClose(targ, 'repeat');
      } else if (targ.classList.contains('close-btn')) {
        this.modalClose(targ, 'close');
      } else if (targ.classList.contains('modal-sound')) {
        await this.hearSound(targ);
      } else if (targ.classList.contains('word-sound')) {
        await this.soundOn(targ);
      }
    });
  }

  async soundOn(elem: HTMLElement) {
    const audio = elem.children[0] as HTMLAudioElement;
    await audio.play();
  }

  async checkLevel(elem: HTMLElement | number) {
    let userWods: string[] | undefined = [];
    const serWods = await this.model.getUserWords();
    if (serWods === 0) {
      userWods = undefined;
    } else {
      userWods = (serWods as IUserWord[]).map((item) => item.wordId) as string[];
    }
    if (typeof elem === 'number') {
      const words = await Model.getWords(elem, this.level);
      if (!userWods) {
        this.wordsArray = words;
      } else {
        this.wordsArray = words.filter((item) => !(userWods as string[]).includes(item.id));
      }
    } else {
      this.counter = 0;
      this.point = 10;
      this.score = 0;
      const lvl = elem.id;
      this.level = +lvl[lvl.length - 1] - 1;
      const words = await Model.getWords(this.page, this.level);
      if (!userWods) {
        this.wordsArray = words;
      } else {
        this.wordsArray = words.filter((item) => !(userWods as string[]).includes(item.id));
      }
      console.log(this.wordsArray);
      const startBtn = elem.parentElement?.nextElementSibling as HTMLButtonElement;
      startBtn.disabled = false;
    }
  }

  sprintTimer() {
    const sprintTimer = document.querySelector('.sprint-timer span') as HTMLElement;
    let counterTime = 60;
    const timer = setInterval(() => {
      counterTime -= 1;
      if (counterTime === 0) {
        clearInterval(timer);
        this.modalActive();
        if (this.checkLogIn()) {
          this.sendResultToStatic();
        }
        this.wrongWords = [];
        this.correctWords = [];
      }
      sprintTimer.innerHTML = `${counterTime}`;
    }, 1000);
  }

  checkLogIn() {
    const logPar = localStorage.getItem('sthmPasMail');
    const tokenUser = localStorage.getItem('newUserDataRSlang');
    const creatUser = localStorage.getItem('authDataRSlang');
    if (logPar !== null || tokenUser !== null || creatUser !== null) {
      return true;
    }
    return false;
  }

  sendResultToStatic() {
    this.wrongWords.forEach(async (item) => {
      const res = await this.static.writeWordStat('sprint', item, false);
    });
    this.correctWords.forEach(async (item) => {
      const res = await this.static.writeWordStat('sprint', item, true);
    });
  }

  countScore(str: string) {
    const scoreBlock = document.querySelector('.sprint-point') as HTMLElement;
    const correctPointBlock = document.querySelector('.time-animation-block span') as HTMLElement;
    const counterBlock = document.querySelector('.some-animation span') as HTMLElement;

    if (str === 'correct') {
      if (this.counter === 3 && this.point < 80) {
        this.point *= 2;
        this.score += this.point;
        correctPointBlock.textContent = `+${this.point}`;
        scoreBlock.textContent = `${this.score}`;
        this.counter = 0;
        this.counter += 1;
        counterBlock.textContent = `${this.counter}`;
      } else {
        this.score += this.point;
        correctPointBlock.textContent = `+${this.point}`;
        scoreBlock.textContent = `${this.score}`;
        this.counter += 1;
        counterBlock.textContent = `${this.counter}`;
      }
    } else if (str === 'wrong') {
      this.point = 10;
      correctPointBlock.textContent = `+${this.point}`;
      this.counter = 0;
      counterBlock.textContent = `${this.counter}`;
    }
  }

  async pastWordToPlayGame(elem: HTMLElement) {
    this.sprintTimer();
    const parent = elem.parentElement;
    parent!.classList.add('check-level-act');
    (<HTMLElement>document.querySelector('.sprint-play-wrapper')).classList.add('sprint-play-wrapper-active');
    const audioTag = document.querySelector('audio') as HTMLAudioElement;
    const correctBtn = document.querySelector('.btn-success') as HTMLButtonElement;
    const wrongtBtn = document.querySelector('.btn-danger') as HTMLButtonElement;
    const taskBlock = document.querySelector('.task-block') as HTMLElement;
    const englishWord = taskBlock.children[1] as HTMLElement;
    const russiaWord = taskBlock.children[2] as HTMLElement;
    this.len = this.wordsArray.length;

    this.engWords = this.shuffleArray(this.wordsArray);
    this.rusWords = this.engWords.map((item, ind, arr) => {
      const random = Math.floor(Math.random() * 3) + ind;
      return arr[random] === undefined ? item : arr[random];
    });
    englishWord.innerHTML = this.engWords[this.count].word;
    russiaWord.innerHTML = this.rusWords[this.count].wordTranslate;
    audioTag.src = `${baseUrl}/${this.engWords[this.count].audio}`;

    window.addEventListener('keydown', this.arrow);
    correctBtn.addEventListener('click', this.nextWord);
    wrongtBtn.addEventListener('click', this.nextWord);
    await this.nextWord('start');
  }

  arrow = async (e: KeyboardEvent) => {
    const key = e.code;
    if (key === 'ArrowRight' || key === 'ArrowLeft') {
      await this.nextWord(key);
    }
  };

  pastEffect(str: string) {
    const gameBlock = <HTMLElement>document.querySelector('.sprint-play-wrapper');
    if (str === 'correct') {
      gameBlock.classList.add('correct');
      gameBlock.classList.remove('wrong');
    } else {
      gameBlock.classList.remove('correct');
      gameBlock.classList.add('wrong');
    }
  }

  removeEffect() {
    const gameBlock = <HTMLElement>document.querySelector('.sprint-play-wrapper');
    gameBlock.classList.remove('correct');
    gameBlock.classList.remove('wrong');
  }

  nextWord = async (e: Event | string) => {
    const taskBlock = document.querySelector('.task-block') as HTMLElement;
    const soundWord = taskBlock.children[0].children[0] as HTMLAudioElement;
    const englishWord = taskBlock.children[1] as HTMLElement;
    const russiaWord = taskBlock.children[2] as HTMLElement;
    if (e === 'start') {
      return;
    }
    if (this.count === this.len - 1) {
      // this.modalActive();
      this.count = 0;
      this.page += 1;
      await this.checkLevel(this.page);
    }
    const rusWord = this.rusWords[this.count];
    const engWord = this.engWords[this.count];
    const forAudio = this.engWords[this.count + 1];
    soundWord.src = '';
    soundWord.src = `${baseUrl}/${forAudio.audio}`;

    if (e === 'ArrowRight' && rusWord.word === engWord.word) {
      this.correctWords.push(engWord);
      this.countScore('correct');
      this.pastEffect('correct');
      this.count += 1;
      englishWord.innerHTML = this.engWords[this.count].word;
      russiaWord.innerHTML = this.rusWords[this.count].wordTranslate;
      setTimeout(() => this.removeEffect(), 100);
      return;
    }
    if (e === 'ArrowRight' && rusWord.word !== engWord.word) {
      this.wrongWords.push(engWord);
      this.countScore('wrong');
      this.pastEffect('wrong');
      this.count += 1;
      englishWord.innerHTML = this.engWords[this.count].word;
      russiaWord.innerHTML = this.rusWords[this.count].wordTranslate;
      setTimeout(() => this.removeEffect(), 100);
      return;
    }
    if (e === 'ArrowLeft' && rusWord.word === engWord.word) {
      this.wrongWords.push(engWord);
      this.countScore('wrong');
      this.pastEffect('wrong');
      this.count += 1;
      englishWord.innerHTML = this.engWords[this.count].word;
      russiaWord.innerHTML = this.rusWords[this.count].wordTranslate;
      setTimeout(() => this.removeEffect(), 100);
      return;
    }
    if (e === 'ArrowLeft' && rusWord.word !== engWord.word) {
      this.correctWords.push(engWord);
      this.countScore('correct');
      this.pastEffect('correct');
      this.count += 1;
      englishWord.innerHTML = this.engWords[this.count].word;
      russiaWord.innerHTML = this.rusWords[this.count].wordTranslate;
      setTimeout(() => this.removeEffect(), 100);
      return;
    }
    const target = (e as Event).target as HTMLButtonElement;
    if (target.classList.contains('btn-success') && rusWord.word === engWord.word) {
      this.correctWords.push(engWord);
      this.countScore('correct');
      this.pastEffect('correct');
      this.count += 1;
      englishWord.innerHTML = this.engWords[this.count].word;
      russiaWord.innerHTML = this.rusWords[this.count].wordTranslate;
      setTimeout(() => this.removeEffect(), 100);
      return;
    }
    if (target.classList.contains('btn-success') && rusWord.word !== engWord.word) {
      this.wrongWords.push(engWord);
      this.countScore('wrong');
      this.pastEffect('wrong');
      this.count += 1;
      englishWord.innerHTML = this.engWords[this.count].word;
      russiaWord.innerHTML = this.rusWords[this.count].wordTranslate;
      setTimeout(() => this.removeEffect(), 100);
      return;
    }
    if (target.classList.contains('btn-danger') && rusWord.word !== engWord.word) {
      this.correctWords.push(engWord);
      this.countScore('correct');
      this.pastEffect('correct');
      this.count += 1;
      englishWord.innerHTML = this.engWords[this.count].word;
      russiaWord.innerHTML = this.rusWords[this.count].wordTranslate;
      setTimeout(() => this.removeEffect(), 100);
      return;
    }
    if (target.classList.contains('btn-danger') && rusWord.word === engWord.word) {
      this.wrongWords.push(engWord);
      this.countScore('wrong');
      this.pastEffect('wrong');
      this.count += 1;
      englishWord.innerHTML = this.engWords[this.count].word;
      russiaWord.innerHTML = this.rusWords[this.count].wordTranslate;
      setTimeout(() => this.removeEffect(), 100);
    }
  };

  shuffleArray(array: IWord[]) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  fullScreen(elem: HTMLElement) {
    elem.addEventListener('click', async () => {
      if (document.fullscreenElement === null) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    });
  }

  modalActive() {
    const modalBG = document.querySelector('.modal-bg') as HTMLElement;
    const modalWrapper = document.querySelector('.modal-wrapper') as HTMLElement;
    const wrongTable = document.querySelector('.wrong-answer') as HTMLTableElement;
    const correctTable = document.querySelector('.correct-answer') as HTMLTableElement;
    window.removeEventListener('keydown', this.arrow);
    modalBG.classList.add('modal-bg-act');
    modalWrapper.classList.add('modal-wrapper-act');
    correctTable.innerHTML = '';
    for (let i = 0; i < this.correctWords.length; i += 1) {
      const { id } = this.correctWords[i];
      const eng = this.correctWords[i].word;
      const rus = this.correctWords[i].wordTranslate;
      const sound = `${baseUrl}/${this.correctWords[i].audio}`;
      const tr = this.pastResultWords(id, sound, eng, rus);
      correctTable.append(tr);
    }
    wrongTable.innerHTML = '';
    for (let i = 0; i < this.wrongWords.length; i += 1) {
      const { id } = this.wrongWords[i];
      const eng = this.wrongWords[i].word;
      const rus = this.wrongWords[i].wordTranslate;
      const sound = `${baseUrl}/${this.wrongWords[i].audio}`;
      const tr = this.pastResultWords(id, sound, eng, rus);
      wrongTable.append(tr);
    }
  }

  modalClose(elem: HTMLElement, str: string) {
    // console.log(elem);
    const modalBG = document.querySelector('.modal-bg') as HTMLElement;
    const modalWrapper = document.querySelector('.modal-wrapper') as HTMLElement;
    const checkLevel = document.querySelector('.check-level') as HTMLElement;
    const playWrapper = document.querySelector('.sprint-play-wrapper') as HTMLElement;
    const targ = document.querySelector('.btn-check') as HTMLElement;
    this.counter = 0;
    this.point = 10;
    this.score = 0;
    if (str === 'repeat') {
      modalBG.classList.remove('modal-bg-act');
      modalWrapper.classList.remove('modal-wrapper-act');
      checkLevel.classList.remove('check-level-act');
      playWrapper.classList.remove('sprint-play-wrapper-active');
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.checkLevel(targ);
    } else {
      modalBG.remove();
      modalWrapper.remove();
    }
  }

  pastResultWords(id: string, audio: string, eng: string, rus: string) {
    const tr = document.createElement('tr') as HTMLElement;
    tr.innerHTML = `
      <td class="modal-sound">
      <audio src="${audio}" id="${id}"></audio>
      </td>
      <td class="wr-eng">${eng}</td>
      <td class="wr-ru">${rus}</td>
    `;
    return tr;
  }

  async hearSound(elem: HTMLElement) {
    const audio = elem.children[0] as HTMLAudioElement;
    await audio.play();
  }
}
