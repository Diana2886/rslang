import Model from '../../../model/components/index';
import { IWord } from '../../../types/index';
import Page from '../../core/templates/page';
import './audioChallenge.scss';

const random = (max: number) => Math.floor(Math.random() * max) + 1;

type GameData = {
  word: IWord;
  variants: IWord[];
};
class AudioChallenge extends Page {
  async createData(group: number) {
    const gameData: GameData[] = [];
    const page = random(29);
    const words = await Model.getWords(page, group);
    const newArr: IWord[] = words.sort(() => Math.random() - 0.5);
    newArr.forEach((word) => {
      let variants: IWord[] = [];
      while (variants.length < 4) {
        const index = random(19);
        const item = words[index];
        variants.push(item);
        variants = variants.filter((element) => element.word !== word.word);
        variants = [...new Set(variants)];
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

  private drawResult(corrects: IWord[], wrongs: IWord[]) {
    const result = document.createElement('div');
    result.className = 'result';
    const resultBody = document.createElement('div');
    result.append(resultBody);
    resultBody.className = 'result__body';
    const correctTitle = document.createElement('h5');
    correctTitle.textContent = 'Correct answers:';
    const correctList = document.createElement('ul');
    correctList.append(correctTitle)
    correctList.className = 'result__list result__list_correct';
    corrects.forEach((element) => {
      const point = document.createElement('li');
      const imgAudio = document.createElement('img');
      const audioRes = document.createElement('audio');
      audioRes.src = `http://localhost:3000/${element.audio}`;
      imgAudio.src = 'assets/svg/compact-cassette.svg';
      imgAudio.addEventListener('click', () => {
        audioRes.play().catch((err) => console.log(err));
      });

      const engText = document.createElement('span');
      engText.textContent = `${element.word} -`;
      const ruText = document.createElement('span');
      ruText.textContent = element.wordTranslate;

      [imgAudio, engText, ruText].forEach((item) => point.append(item));
      correctList.append(point);
    });

    const wrongList = document.createElement('ul');
    wrongList.className = 'result__list result__list_wrong';
    const wrongTitle = document.createElement('h5'); 
    wrongTitle.textContent = 'Wrong answers:';
    wrongList.append(wrongTitle)
    wrongs.forEach((element) => {
      const point = document.createElement('li');
      const imgAudio = document.createElement('img');
      imgAudio.src = 'assets/svg/compact-cassette.svg';
      const audioRes = document.createElement('audio');
      audioRes.src = `http://localhost:3000/${element.audio}`;
      imgAudio.addEventListener('click', () => {
        audioRes.play().catch((err) => console.log(err));
      });
      const engText = document.createElement('span');
      engText.textContent = `${element.word} -`;
      const ruText = document.createElement('span');
      ruText.textContent = element.wordTranslate;
      [imgAudio, engText, ruText].forEach((item) => point.append(item));
      wrongList.append(point);
    });

    const restartBtn = document.createElement('button');
    restartBtn.className = 'result__restart-btn btn btn-primary';
    restartBtn.textContent = 'ReStart';
    restartBtn.addEventListener('click', () => {
      this.container.innerHTML = '';
      this.render();
    });
    result.append(restartBtn);
    [correctList, wrongList].forEach((item) => resultBody.append(item));
    return result;
  }

  async startGame(group: number) {
    const corrects: IWord[] = [];
    const wrongs: IWord[] = [];
    let i = 0;
    const data = await this.createData(group);
    const gameBody = document.createElement('div');
    const imageDiv = document.createElement('div');
    imageDiv.className = 'play-image';
    const image = document.createElement('img');
    const text = document.createElement('div');
    text.className = 'play-text';
    const audio = document.createElement('audio');
    image.addEventListener('click', () => {
      audio.play().catch((err) => console.log(err));
    });
    imageDiv.append(image);
    imageDiv.append(text);
    imageDiv.append(audio);
    gameBody.className = 'game-body';

    const gaming = () => {
      imageDiv.classList.remove('showed');
      text.textContent = '';
      const example = data[i];
      image.src = 'assets/svg/compact-cassette.svg';
      audio.src = `http://localhost:3000/${example.word.audio}`;
      audio.autoplay = true;
      const variantsBtns = document.createElement('div');
      variantsBtns.className = 'variants__btns';
      example.variants.forEach((item, index) => {
        const btnDiv = document.createElement('button');
        btnDiv.className = 'audio-call__choose-btn';
        btnDiv.type = 'button';
        btnDiv.textContent = `${index + 1} ${item.wordTranslate}`;
        btnDiv.addEventListener('click', () => {
          variantsBtns.classList.add('disabled');
          imageDiv.classList.add('showed');
          if (btnDiv.textContent === `${index + 1} ${example.word.wordTranslate}`) {
            btnDiv.classList.add('correct');
            corrects.push(example.word);
          } else {
            btnDiv.classList.add('wrong');
            wrongs.push(example.word);
          }
          image.src = `http://localhost:3000/${example.word.image}`;
          text.textContent = example.word.word;
          i += 1;
          if (i < 20) {
            setTimeout(gaming, 2000);
          } else {
            window.dispatchEvent(new CustomEvent('done'));
          }
        });
        variantsBtns.append(btnDiv);
      });
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
        gameBody.innerHTML = '';
        gameBody.append(this.drawResult(corrects, wrongs));
      });
      gameBody.innerHTML = '';
      gameBody.append(imageDiv);
      gameBody.append(variantsBtns);
    };
    gaming();
    return gameBody;
  }

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
    audioCallText.textContent = 'Listen to the words and choose the correct translation.';
    const levelBtnBody = this.drawLevelBtn();

    const startButton = document.createElement('div');
    const chooseLevel = levelBtnBody.querySelector('.choose-level');
    startButton.className = 'game-start__btn';
    startButton.classList.add('disabled');
    let level = 0;

    chooseLevel?.addEventListener('change', (e) => {
      chooseLevel.classList.add('active');
      const levelInput = <HTMLInputElement>e.target;
      level = +levelInput.value;
      startButton.classList.remove('disabled');
    });
    [audioCallTitle, image, audioCallText, levelBtnBody, startButton].forEach((element) => greetBlock.append(element));
    startButton.innerHTML = `<button id="Audio-call-start" type="button" class="btn btn-primary">Start</button>`;

    startButton.addEventListener(
      'click',
      (e) => {
        startButton.classList.add('disabled');
        greetBlock.innerHTML = '';
        chooseLevel?.classList.remove('active');
        this.startGame(level)
          .then((el) => {
            greetBlock.append(el);
          })
          .catch((err) => console.log(err));
        e.target?.removeEventListener('click', () => {
          startButton.classList.add('disabled');
          greetBlock.innerHTML = '';
          chooseLevel?.classList.remove('active');
          this.startGame(level)
            .then((el) => {
              greetBlock.append(el);
            })
            .catch((err) => console.log(err));
        });
      },
      { once: true }
    );
    window.addEventListener('keyup', (e) => {
      const number: number = +e.key;
      if (number > 0 && number < 7) {
        const levelPress = number - 1;
        if (chooseLevel) {
          const inputs = chooseLevel.querySelectorAll('input');
          const input = inputs[levelPress];
          input.checked = true;
          level = levelPress;
          startButton.autofocus = true;
          startButton.classList.remove('disabled');
          chooseLevel.classList.add('active');
        }
      }
      if (e.code === 'Enter') {
        if (chooseLevel?.classList.contains('active')) {
          startButton.click();
        }
      }
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
    return audioCall;
  }

  render() {
    const audioCall = this.drawAudioCall();
    this.container.append(audioCall);
    return this.container;
  }
}

export default AudioChallenge;
