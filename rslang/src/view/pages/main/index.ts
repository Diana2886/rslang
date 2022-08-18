import Page from '../../core/templates/page';

class MainPage extends Page {
  static TextObject = {
    MainTitle: `Let's Find The Right <span class="text_colored">Course</span> For you`,
    MainText: `
      Our online application will help you learn many different words without tedious memorization,
      through games and listening to the pronunciation of words with their context.
      You can register in our app and get more features, like you can track your progress,
      add difficult words to your word list for further revision, etc.
    `,
  };

  render() {
    const mainContent = document.createElement('div');
    mainContent.classList.add('main-page__content');
    const title = this.createHeaderTitle(MainPage.TextObject.MainTitle);
    const text = document.createElement('p');
    text.classList.add('main__text');
    text.innerHTML = MainPage.TextObject.MainText;
    mainContent.append(title, text);
    const mainContainer = document.createElement('div');
    mainContainer.classList.add('main__container');
    const img = document.createElement('div');
    img.classList.add('main__img');
    mainContainer.append(mainContent, img);
    this.container.append(mainContainer);
    return this.container;
  }
}

export default MainPage;
