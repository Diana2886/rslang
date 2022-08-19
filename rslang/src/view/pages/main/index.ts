import Page from '../../core/templates/page';
import PageIds from '../app/pageIds';

class MainPage extends Page {
  static TextObject = {
    MainTitle: `Join our <span class="text_colored">English vocabulary</span> learning course!`,
    MainText: `
      Our online application will help you learn many different words without tedious memorization,
      through games and listening to the pronunciation of words with their context.
      If you sign up, you will be able to get more features like tracking your progress,
      adding difficult words to the word list for later revision, etc.
    `,
    ToolsTitle: `What do You Get From the App`,
    ToolsText: `In this application you can find a textbook and two games to help you learn new words and remember them better in a playful way`,
    Tools: [
      {
        icon: './assets/svg/book.svg',
        title: 'Textbook',
        content: 'Learn words in their context and listen to their pronunciation',
        pageId: PageIds.Textbook,
      },
      {
        icon: './assets/svg/headphones.svg',
        title: 'Audio challenge',
        content: 'Test your listening skills by choosing the correct word translation',
        pageId: PageIds.AudioChallenge,
      },
      {
        icon: './assets/svg/person-running.svg',
        title: 'Sprint',
        content: 'Check how many words you can translate in a minute',
        pageId: PageIds.Sprint,
      },
    ],
    Developers: [
      {
        name: 'Diana',
        text: '',
      },
    ],
  };

  renderMainContainer() {
    const mainContent = document.createElement('div');
    mainContent.classList.add('main-page__content');
    const title = this.createHeaderTitle(MainPage.TextObject.MainTitle);
    const text = document.createElement('p');
    text.classList.add('main__text', 'text');
    text.innerHTML = MainPage.TextObject.MainText;
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons__container');
    const template = `
      <a class="nav-link" aria-current="page" href="#signUp-page">
        <button type="button" class="btn btn-primary">Sign up</button>
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
    mainContainer.classList.add('main__container', 'page-container');
    const img = document.createElement('div');
    img.classList.add('main__img');
    mainContainer.append(mainContent, img);
    return mainContainer;
  }

  renderAppToolsContainer() {
    const toolsContainer = document.createElement('div');
    toolsContainer.classList.add('tools__container', 'page-container');
    const toolsContent = document.createElement('div');
    toolsContent.classList.add('tools__content');
    const toolsTitle = document.createElement('h2');
    toolsTitle.classList.add('subtitle');
    toolsTitle.innerText = MainPage.TextObject.ToolsTitle;
    const toolsText = document.createElement('p');
    toolsText.classList.add('tools__text', 'text');
    toolsText.innerText = MainPage.TextObject.ToolsText;
    toolsContent.append(toolsTitle, toolsText);
    toolsContainer.append(toolsContent);

    MainPage.TextObject.Tools.forEach((item) => {
      const link = document.createElement('a');
      link.classList.add('tool__link');
      link.href = `#${item.pageId}`;
      const tool = document.createElement('div');
      tool.classList.add('tools__item');
      const toolIcon = document.createElement('span');
      toolIcon.classList.add('tool__icon');
      toolIcon.style.backgroundImage = `url(${item.icon})`;
      const toolTitle = document.createElement('h4');
      toolTitle.classList.add('tool__title');
      toolTitle.innerText = item.title;
      const toolText = document.createElement('p');
      toolText.classList.add('tool__text');
      toolText.innerText = item.content;
      tool.append(toolIcon, toolTitle, toolText);
      link.append(tool);
      toolsContainer.append(link);
    });

    return toolsContainer;

    // const template = `
    //   <div class="tools__container">
    //     <div class="tools__content">
    //       <h2 class="subtitle">${MainPage.TextObject.ToolsTitle}</h2>
    //       <p class="tools__text text">
    //         ${MainPage.TextObject.ToolsText}
    //       </p>
    //     </div>
    //     <div class="tools__item">
    //       <span class="tool__icon"></span>
    //       <h5 class="tool__title"></h5>
    //     </div>
    //   </div>
    // `;
  }

  renderDevelopersContainer() {

  }

  render() {
    this.container.append(this.renderMainContainer(), this.renderAppToolsContainer());
    return this.container;
  }
}

export default MainPage;
