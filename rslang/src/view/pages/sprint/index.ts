import Page from '../../core/templates/page';

class Sprint extends Page {
  static TextObject = {
    MainTitle: 'Sprint Page',
  };

  render() {
    const title = this.createHeaderTitle(Sprint.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}

export default Sprint;
