import Page from '../../core/templates/page';

class MainPage extends Page {
  static TextObject = {
    MainTitle: `Join our <span class="text_colored">English vocabulary</span> learning course!`,
    MainText: `
      Our online application will help you learn many different words without tedious memorization,
      through games and listening to the pronunciation of words with their context.
      If you sign up, you will be able to get more features like tracking your progress,
      adding difficult words to the word list for later revision, etc.
    `,
  };

  renderMainContent() {
    const mainContent = document.createElement('div');
    mainContent.classList.add('main-page__content');
    const title = this.createHeaderTitle(MainPage.TextObject.MainTitle);
    const text = document.createElement('p');
    text.classList.add('main__text');
    text.innerHTML = MainPage.TextObject.MainText;
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons__container');
    const template = `
      <a class="nav-link" aria-current="page" href="#register-page">
        <button type="button" class="btn btn-primary">Register</button>
      </a>
      <a class="nav-link" aria-current="page" href="#">
        <div class="play-button">
          <span class="play-icon"></span>Play Video
        </div>
      </a>
    `;
    buttonsContainer.innerHTML = template;
    mainContent.append(title, text, buttonsContainer);
    const mainContainer = document.createElement('div');
    mainContainer.classList.add('main__container');
    const img = document.createElement('div');
    img.classList.add('main__img');
    mainContainer.append(mainContent, img);
    return mainContainer;
  }

  // renderAppTools() {

  // }

  render() {
    this.container.append(this.renderMainContent());
    return this.container;
  }
}

export default MainPage;
