import Model from '../../../model/components/index';
import { IWord } from '../../../types/index';
import Page from '../../core/templates/page';
import './audioChallenge.scss';

const model = new Model();
const page = 1;

const random = (max: number) => Math.floor(Math.random() * max) + 1;
type GameData = {
  word: IWord;
  variants: IWord[];
};
class AudioChallenge extends Page {
  async createData(group: number) {
    const newArr: IWord[] = [];
    const gameData: GameData[] = [];
    const indexes: number[] = [];
    const words = await model.getWords(1, group);

    while (indexes.length < 20) {
      const index = random(19);
      indexes.push(index);
    }
    indexes.forEach((index) => {
      newArr.push(words[index]);
    });

    newArr.forEach((word) => {
      const variants: IWord[] = [];
      while (variants.length < 4) {
        const index = random(19);
        const item = words[index];

        variants.push(item);
      }
      const i = random(4);
      variants.splice(i, 0, word);
      gameData.push({
        word,
        variants,
      });
    });
    return gameData;
  }

  async startGame(group: number) {
    const data = await this.createData(group);
    const example = data[0];
    const gameBody = document.createElement('div');
    gameBody.className = 'game-body';
    const audio = document.createElement('audio');
    const imageDiv = document.createElement('div');
    const image = document.createElement('img');
    imageDiv.append(image);
    image.src = 'http://localhost:8080/assets/svg/compact-cassette-157537.svg';
    audio.src = `http://localhost:3000/${example.word.audio}`;
    const variantsBtns = document.createElement('div');
    variantsBtns.className = 'variants__btns';
    example.variants.forEach((item) => {
      const btnDiv = document.createElement('div');
      btnDiv.innerHTML = `<button type="button" class="btn btn-primary">${item.word}</button>`;
      variantsBtns.append(btnDiv);
    });
    console.log(variantsBtns);
    gameBody.append(imageDiv);
    gameBody.append(variantsBtns);
    audio.autoplay = true;
    return gameBody;
  }

  drawInit() {
    const greetBlock = document.createElement('div');
    greetBlock.className = 'greetBlock';
    const image = document.createElement('div');
    image.className = 'audio-call__image';
    const audioCallTitle = <HTMLElement>document.createElement('h3');
    audioCallTitle.textContent = 'Игра "Аудиовызов"';
    const audioCallText = <HTMLElement>document.createElement('p');
    audioCallText.textContent = 'Правило игры: выслушать слова и выбрать правильный вариант.';
    const startButton = document.createElement('div');
    startButton.addEventListener('click', () => {
      greetBlock.innerHTML = '';
      greetBlock.append(this.drawLevelBtn());
    });
    startButton.innerHTML = `<button id="Audio-call-start" type="button" class="btn btn-primary">Начать игру</button>`;
    [audioCallTitle, image, audioCallText, startButton].forEach((element) => greetBlock.append(element));
    return greetBlock;
  }

  drawLevelBtn() {
    const levelBtnBody: HTMLElement = document.createElement('div');
    const levelTitle = document.createElement('h4');
    levelBtnBody.className = 'audio-call__level-choose active';
    levelTitle.textContent = 'Выберите уровень?';
    levelBtnBody.innerHTML = `<div class="choose-level btn-group" role="group" aria-label="Basic radio toggle button group">
    <input type="radio" class="btn-check btn-sm" name="btnradio" value ="0" id="btnradio2" autocomplete="off">
    <label class="btn btn-outline-primary btn-sm" for="btnradio2" >1</label>
  
    <input type="radio" class="btn-check btn-sm" name="btnradio" value ="1" id="btnradio3" autocomplete="off">
    <label class="btn btn-outline-primary btn-sm" for="btnradio3" >2</label>

    <input type="radio" class="btn-check btn-sm" name="btnradio"  value ="2" id="btnradio4" autocomplete="off">
    <label class="btn btn-outline-primary btn-sm" for="btnradio4" >3</label>
  
    <input type="radio" class="btn-check btn-sm" name="btnradio"  value ="3" id="btnradio5" autocomplete="off">
    <label class="btn btn-sm btn-outline-primary" for="btnradio5" >4</label>
  
    <input type="radio" class="btn-check btn-sm" name="btnradio"  value ="4" id="btnradio6" autocomplete="off">
    <label class="btn btn-sm btn-outline-primary" for="btnradio6">5</label>

    <input type="radio" class="btn-check btn-sm" name="btnradio" value ="5" id="btnradio7" autocomplete="off">
    <label class="btn btn-sm btn-outline-primary" for="btnradio7">6</label>
  </div>`;
    const getWordsByGroup = async (event: Event) => {
      const levelInput = <HTMLInputElement>event.target;
      console.log(levelInput.value);
      const group = +levelInput.value;
      const data = await this.startGame(group);
      return data;
    };

    const chooseLevel = levelBtnBody.querySelector('.choose-level');
    chooseLevel?.addEventListener('change', (e) => {
      chooseLevel.classList.remove('active');
      levelBtnBody.innerHTML = '';
      getWordsByGroup(e)
        .then((res) => {
          levelBtnBody.append(res);
        })
        .catch((err) => console.error(err));
    });
    levelBtnBody.prepend(levelTitle);

    return levelBtnBody;
  }

  drawAudioCall() {
    const audioCall = document.createElement('div');
    audioCall.className = 'audio-call';

    const container = document.createElement('div');
    const audioCallBody = document.createElement('div');
    audioCallBody.className = 'audio-call__body';
    container.className = 'container';
    container.append(audioCallBody);

    audioCallBody.append(this.drawInit());

    audioCall.append(container);
    return audioCall;
  }

  render() {
    const audioCall = this.drawAudioCall();
    this.container.append(audioCall);
    return this.container;
  }
}

export default AudioChallenge;
