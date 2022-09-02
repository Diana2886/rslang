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

  // timerID: NodeJS.Timer | undefined;

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
    // this.timerID = undefined;
    this.score = 0;
    this.point = 10;
    this.counter = 0;
  }

  static timerID: undefined | NodeJS.Timer = undefined;

  checkSprintElem() {
    const container = document.querySelector('.container') as HTMLElement;
    clearInterval(SprintController.timerID);
    // console.log(this.timerID);
    console.log(SprintController.timerID);

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

  filterUserWords = async () => {
    const serWods = await this.model.getUserWords();
    if (serWods === 0) {
      return undefined;
    }
    return (serWods as IUserWord[])
      .filter((item) => item.difficulty === 'learned')
      .map((item) => item.wordId) as string[];
  };

  async checkLevel(elem: HTMLElement | number) {
    const userWods: string[] | undefined = await this.filterUserWords();
    // const [[id, difficult]] = userWods!;
    // clearInterval(SprintController.timerID);
    console.log(SprintController.timerID);
    if (typeof elem === 'number') {
      if (!userWods) {
        this.wordsArray = await Model.getWords(elem, this.level);
      } else {
        // this.wordsArray = await this.filterWords(this.page, this.level, userWods);
      }
    } else {
      this.counter = 0;
      this.point = 10;
      this.score = 0;
      const lvl = elem.id;
      this.level = +lvl[lvl.length - 1] - 1;

      if (!userWods) {
        this.wordsArray = await Model.getWords(this.page, this.level);
      } else {
        this.wordsArray = await this.filterWords(this.page, this.level, userWods);
      }

      const startBtn = elem.parentElement?.nextElementSibling as HTMLButtonElement;
      startBtn.disabled = false;
    }
  }

  filterWords = async (page: number, lvl: number, arr: string[]): Promise<IWord[]> => {
    const words = await Model.getWords(page, lvl);
    const newWords = words.filter((item: IWord) => !arr.includes(item.id));
    if (newWords.length === 1) {
      this.page = page + 1;
      return this.filterWords(page + 1, lvl, arr);
    }
    return newWords;
  };

  sprintTimer() {
    const sprintTimer = document.querySelector('.sprint-timer span') as HTMLElement;
    let counterTime = 60;
    SprintController.timerID = setInterval(() => {
      counterTime -= 1;
      if (counterTime === 0) {
        clearInterval(SprintController.timerID);
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

  async pastWordToPlayGame(elem?: HTMLElement) {
    this.sprintTimer();
    const parent = elem!.parentElement;
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
    await this.nextWord('start');
    window.addEventListener('keyup', this.arrow);
    correctBtn.addEventListener('click', this.nextWord);
    wrongtBtn.addEventListener('click', this.nextWord);
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
      gameBlock.classList.add('correct_sprint');
      gameBlock.classList.remove('wrong_sprint');
    } else {
      gameBlock.classList.remove('correct_sprint');
      gameBlock.classList.add('wrong_sprint');
    }
  }

  removeEffect() {
    const gameBlock = <HTMLElement>document.querySelector('.sprint-play-wrapper');
    gameBlock.classList.remove('correct_sprint');
    gameBlock.classList.remove('wrong_sprint');
  }

  nextWord = async (e: Event | string) => {
    const taskBlock = document.querySelector('.task-block') as HTMLElement;
    const soundWord = taskBlock.children[0].children[0] as HTMLAudioElement;
    const englishWord = taskBlock.children[1] as HTMLElement;
    const russiaWord = taskBlock.children[2] as HTMLElement;

    if (this.count === this.len - 1) {
      // this.modalActive();
      this.count = 0;
      this.page += 1;
      await this.checkLevel(this.page);
      this.engWords = this.shuffleArray(this.wordsArray);
      this.rusWords = this.engWords.map((item, ind, arr) => {
        const random = Math.floor(Math.random() * 3) + ind;
        return arr[random] === undefined ? item : arr[random];
      });
    }
    const rusWord = this.rusWords[this.count];
    const engWord = this.engWords[this.count];

    if (e === 'start') {
      return;
    }
    const result = this.checkAnswerWord(engWord.word, rusWord.word, e);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    if (result === 'correct') {
      // await this.static.writeWordStat('sprint', engWord, true);
      this.correctWords.push(engWord);
    } else {
      // await this.static.writeWordStat('sprint', engWord, false);
      this.wrongWords.push(engWord);
    }
    this.countScore(result);
    this.pastEffect(result);
    this.count += 1;
    setTimeout(() => this.removeEffect(), 100);

    const forAudio = this.engWords[this.count];
    soundWord.src = '';
    soundWord.src = `${baseUrl}/${forAudio.audio}`;
    englishWord.innerHTML = this.engWords[this.count].word;
    russiaWord.innerHTML = this.rusWords[this.count].wordTranslate;
  };

  checkAnswerWord(eng: string, rus: string, elem: string | Event) {
    if (typeof elem === 'string') {
      if ((eng === rus && elem === 'ArrowRight') || (eng !== rus && elem === 'ArrowLeft')) {
        return 'correct';
      }
      return 'wrong';
    }
    const target = elem.target as HTMLElement;
    // eslint-disable-next-line prettier/prettier
      if ((eng === rus && target.classList.contains('btn-success')) || (eng !== rus && target.classList.contains('btn-danger'))) {
      return 'correct';
    }
    return 'wrong';
  }

  shuffleArray(array: IWord[]) {
    const arr = array.sort(() => Math.random() - 0.5);
    return arr;
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
    window.removeEventListener('keyup', this.arrow);
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
    const modalBG = document.querySelector('.modal-bg') as HTMLElement;
    const modalWrapper = document.querySelector('.modal-wrapper') as HTMLElement;
    const checkLevel = document.querySelector('.check-level') as HTMLElement;
    const playWrapper = document.querySelector('.sprint-play-wrapper') as HTMLElement;
    const targ = document.querySelector('.btn-check') as HTMLElement;
    this.counter = 0;
    this.point = 10;
    this.score = 0;
    if (str === 'repeat') {
      this.correctWords = [];
      this.wrongWords = [];
      modalBG.classList.remove('modal-bg-act');
      modalWrapper.classList.remove('modal-wrapper-act');
      checkLevel.classList.remove('check-level-act');
      playWrapper.classList.remove('sprint-play-wrapper-active');
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.checkLevel(targ);
    } else {
      this.correctWords = [];
      this.wrongWords = [];
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
