import { baseURL } from '../../../model/components/index';
import { IWord } from '../../../types/index';

export default class AudioResult {
  drawResult(corrects: IWord[], wrongs: IWord[]) {
    const result = document.createElement('div');
    result.className = 'result';
    const resultBody = document.createElement('div');
    result.append(resultBody);
    resultBody.className = 'result__body';
    const correctTitle = document.createElement('h5');
    correctTitle.innerHTML = `Correct <span class="result__correct-count">${corrects.length}</span>`;
    const correctList = document.createElement('ul');
    correctList.append(correctTitle);
    correctList.className = 'result__list result__list_correct';
    this.drawList(corrects, correctList);

    const wrongList = document.createElement('ul');
    wrongList.className = 'result__list result__list_wrong';
    const wrongTitle = document.createElement('h5');
    wrongTitle.innerHTML = `Wrong <span class="result__wrong-count">${wrongs.length}</span>`;
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
      audioRes.src = `${baseURL}/${element.audio}`;
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
