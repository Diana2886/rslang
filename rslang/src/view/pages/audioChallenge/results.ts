import { IWord } from '../../../types/index';

export default class AudioResult {
  drawResult(corrects: IWord[], wrongs: IWord[]) {
    const result = document.createElement('div');
    result.className = 'result';
    const resultBody = document.createElement('div');
    result.append(resultBody);
    resultBody.className = 'result__body';
    const correctTitle = document.createElement('h5');
    correctTitle.textContent = 'Correct answers:';
    const correctList = document.createElement('ul');
    correctList.append(correctTitle);
    correctList.className = 'result__list result__list_correct';
    this.drawList(corrects, correctList);

    const wrongList = document.createElement('ul');
    wrongList.className = 'result__list result__list_wrong';
    const wrongTitle = document.createElement('h5');
    wrongTitle.textContent = 'Wrong answers:';
    wrongList.append(wrongTitle);
    this.drawList(wrongs, wrongList);
    result.append(this.drawReStart());
    [correctList, wrongList].forEach((item) => resultBody.append(item));
    return result;
  }

  private drawList(words: IWord[], list: HTMLUListElement) {
    words.forEach((element) => {
      const point = document.createElement('li');
      const imgAudio = document.createElement('img');
      const audioRes = document.createElement('audio');
      audioRes.src = `http://localhost:3000/${element.audio}`;
      imgAudio.src = 'assets/svg/compact-cassette.svg';
      imgAudio.addEventListener('click', () => {
        audioRes.play().catch((err) => console.warn(err));
      });
      const engText = document.createElement('span');
      engText.textContent = `${element.word} -`;
      const ruText = document.createElement('span');
      ruText.textContent = element.wordTranslate;

      [imgAudio, engText, ruText].forEach((item) => point.append(item));
      list.append(point);
    });
  }

  private drawReStart() {
    const restartBtn = document.createElement('button');
    restartBtn.className = 'result__restart-btn btn btn-primary';
    restartBtn.textContent = 'ReStart';
    restartBtn.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('restart'));
    });
    return restartBtn;
  }
}
