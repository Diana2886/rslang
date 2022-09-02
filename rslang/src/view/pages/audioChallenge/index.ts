import Model from '../../../model/components/index';
import Page from '../../core/templates/page';
import AudioGame from './audioChallenge';
import './audioChallenge.scss';

const model = new Model();

class AudioChallenge extends Page {
  audioGame = new AudioGame(model);

  drawInit() {
    const greetBlock = document.createElement('div');
    greetBlock.className = 'greetBlock';
    const image = document.createElement('div');
    const img = document.createElement('img');
    image.append(img);
    img.src = 'assets/img/audiochallenge.png';
    image.className = 'audio-call__image';
    const audioCallTitle = <HTMLElement>document.createElement('h3');
    const audioCallText = <HTMLElement>document.createElement('p');
    audioCallText.textContent = 'Listen these words and choose the correct translation';
    const levelBtnBody = this.drawLevelBtn();

    const startButton = document.createElement('button');
    startButton.type = 'button';

    const chooseLevel = levelBtnBody.querySelector('.choose-level');
    startButton.className = 'game-start__btn';
    startButton.disabled = true;
    let level = 0;

    chooseLevel?.addEventListener('change', (e) => {
      chooseLevel.classList.add('active');
      const levelInput = <HTMLInputElement>e.target;
      level = +levelInput.value;
      startButton.disabled = false;
    });
    [audioCallTitle, image, audioCallText, levelBtnBody, startButton].forEach((element) => greetBlock.append(element));
    startButton.className = 'btn btn-primary';
    startButton.textContent = 'Start';
    startButton.addEventListener(
      'click',
      (e) => {
        startButton.disabled = false;
        greetBlock.innerHTML = '';
        chooseLevel?.classList.remove('active');
        this.audioGame
          .startGame(level)
          .then((el) => {
            greetBlock.append(el);
          })
          .catch((err) => console.log(err));
        e.target?.removeEventListener('click', () => {
          startButton.classList.add('disabled');
          greetBlock.innerHTML = '';
          chooseLevel?.classList.remove('active');
          this.audioGame
            .startGame(level)
            .then((el) => {
              greetBlock.append(el);
            })
            .catch((err) => console.log(err));
        });
      },
      { once: true }
    );
    document.body.addEventListener('keyup', (e) => {
      const number: number = +e.key;
      if (number > 0 && number < 7) {
        const variantsBtns: HTMLButtonElement | null = document.querySelector('.variants__btns');
        const levelPress = number - 1;
        if (chooseLevel) {
          const inputs = chooseLevel.querySelectorAll('input');
          const input = inputs[levelPress];
          input.checked = true;
          level = levelPress;
          startButton.classList.remove('disabled');
          chooseLevel.classList.add('active');
        }
        if (variantsBtns) {
          if (number > 0 && number < 6) {
            const buttons = variantsBtns.querySelectorAll('button');
            const button = buttons[number - 1];
            button.click();
          }
        }
      }
      if (e.code === 'Enter') {
        const nextBtn: HTMLButtonElement | null = document.querySelector('.audio-call__next');
        const modalBtn: HTMLButtonElement | null = document.querySelector('.modal__start-audio');
        if (nextBtn) {
          startButton.disabled = true;
          if (modalBtn){
            modalBtn.disabled = true;
          }
          nextBtn.click();
        }
        if (modalBtn) {
          modalBtn.click();
        }
        if (chooseLevel?.classList.contains('active')) {
          startButton.click();
        }
      }
      if (e.code === 'Space') {
        const playAudioBtn: HTMLButtonElement | null = document.querySelector('.play-image');
        if (playAudioBtn) {
          playAudioBtn.click();
        }
      }
      e.stopImmediatePropagation();
    });
    return greetBlock;
  }

  drawLevelBtn() {
    const levelBtnBody: HTMLElement = document.createElement('form');
    const levelTitle = document.createElement('h5');
    levelBtnBody.className = 'audio-call__level-choose';
    levelTitle.textContent = 'Choose your level:';
    levelBtnBody.innerHTML = `<div class="choose-level btn-group" role="group" aria-label="Basic radio toggle button group">
    <input type="radio" class="btn-check btn-sm" name="btnradio" value ="0" id="btnradio2" autocomplete="off">
    <label class="btn btn-outline-primary btn-sm" for="btnradio2" >A1</label>
  
    <input type="radio" class="btn-check btn-sm" name="btnradio" value ="1" id="btnradio3" autocomplete="off">
    <label class="btn btn-outline-primary btn-sm" for="btnradio3" >A2</label>

    <input type="radio" class="btn-check btn-sm" name="btnradio"  value ="2" id="btnradio4" autocomplete="off">
    <label class="btn btn-outline-primary btn-sm" for="btnradio4" >B1</label>
  
    <input type="radio" class="btn-check btn-sm" name="btnradio"  value ="3" id="btnradio5" autocomplete="off">
    <label class="btn btn-sm btn-outline-primary" for="btnradio5" >B2</label>
  
    <input type="radio" class="btn-check btn-sm" name="btnradio"  value ="4" id="btnradio6" autocomplete="off">
    <label class="btn btn-sm btn-outline-primary" for="btnradio6">C1</label>

    <input type="radio" class="btn-check btn-sm" name="btnradio" value ="5" id="btnradio7" autocomplete="off">
    <label class="btn btn-sm btn-outline-primary" for="btnradio7">C2</label>
  </div>`;
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
    window.addEventListener('restart', () => {
      this.render();
    });
    return audioCall;
  }

  render() {
    this.container.innerHTML = '';
    const audioCall = this.drawAudioCall();
    this.container.append(audioCall);
    return this.container;
  }
}

export default AudioChallenge;
