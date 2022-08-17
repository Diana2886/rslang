import Page from '../../core/templates/page';

class AudioChallenge extends Page {
  static TextObject = {
    MainTitle: 'AudioСhallenge Page',
  };

  render() {
    const title = this.createHeaderTitle(AudioChallenge.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}

export default AudioChallenge;
