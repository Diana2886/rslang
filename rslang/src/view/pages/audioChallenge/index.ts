import Model from '../../../model/components/index';
import Page from '../../core/templates/page';
import './audioChallenge.scss';

const model = new Model();

class AudioChallenge extends Page {
  drawInit() {
    const greetBlock = document.createElement('div');
    greetBlock.className = 'greetBlock'
    const audioCallTitle = <HTMLElement>document.createElement('h3');
    audioCallTitle.textContent = 'Игра "Аудиовызов"';
    const audioCallText = <HTMLElement>document.createElement('p');
    audioCallText.textContent = 'Правило игры: выслушать слова и выбрать правильный вариант.';
    const startButton = document.createElement('div');
    startButton.innerHTML = `<button id="Audio-call-start" type="button" class="btn btn-primary">Начать игру</button>`;
    [audioCallTitle, audioCallText, startButton].forEach((element) => greetBlock.append(element));
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
    async function getWordsByGroup(event: Event) {
      const levelInput = <HTMLInputElement>event.target;
      console.log(levelInput.value);
      const group = +levelInput.value;
      const words = await model.getWords(1, group);
      console.log(words);
    }
    const chooseLevel = levelBtnBody.querySelector('.choose-level');
    chooseLevel?.addEventListener('change', (e) => {
      chooseLevel.classList.remove('active');
      getWordsByGroup(e).catch((err) => console.error(err));
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
