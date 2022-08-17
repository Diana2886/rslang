import Page from '../../core/templates/page';

class AudioСhallenge extends Page {
  static TextObject = {
    MainTitle: 'AudioСhallenge Page',
  };

  render() {
    const title = this.createHeaderTitle(AudioСhallenge.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}

export default AudioСhallenge;
