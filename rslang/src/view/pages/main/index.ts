import Footer from '../../core/components/footer/index';
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
    DevTitle: 'Our team',
    Developers: [
      {
        name: 'Diana Abdykassenova',
        role: 'Team leader, <br>Frontend developer',
        text: 'Made basic project settings, layout of the main page, ...',
        img: './assets/img/diana.jpg',
      },
      {
        name: 'Aibek Kenzhebayev',
        role: 'Frontend developer',
        text: 'Set up an API connection, developed Audio Challenge game,...',
        img: './assets/img/aibek.jpg',
      },
      {
        name: 'Sanjar Tukhtamishev',
        role: 'Frontend developer',
        text: 'Made the login page, Sprint game,...',
        img: './assets/img/sanjar.jpg',
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
    const pageWrapper = document.createElement('div');
    pageWrapper.classList.add('main-page__wrapper', 'main__wrapper');
    const img = document.createElement('div');
    img.classList.add('main__img');
    pageWrapper.append(mainContent, img);
    mainContainer.append(pageWrapper);
    return mainContainer;
  }

  renderAppToolsContainer() {
    const toolsContainer = document.createElement('div');
    toolsContainer.classList.add('tools__container');
    const pageWrapper = document.createElement('div');
    pageWrapper.classList.add('main-page__wrapper', 'tools__wrapper');
    const toolsContent = document.createElement('div');
    toolsContent.classList.add('tools__content');
    const toolsTitle = document.createElement('h2');
    toolsTitle.classList.add('subtitle');
    toolsTitle.innerText = MainPage.TextObject.ToolsTitle;
    const toolsText = document.createElement('p');
    toolsText.classList.add('tools__text', 'text');
    toolsText.innerText = MainPage.TextObject.ToolsText;
    toolsContent.append(toolsTitle, toolsText);
    pageWrapper.append(toolsContent);
    const toolsWrapper = document.createElement('div');
    toolsWrapper.classList.add('tools');

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
      toolsWrapper.append(link);
    });
    pageWrapper.append(toolsWrapper);
    toolsContainer.append(pageWrapper);
    return toolsContainer;
  }

  renderDevelopersContainer() {
    const devContainer = document.createElement('div');
    devContainer.classList.add('dev__container');
    const pageWrapper = document.createElement('div');
    pageWrapper.classList.add('main-page__wrapper', 'dev__wrapper');
    const devTitle = document.createElement('h3');
    devTitle.classList.add('dev__title');
    devTitle.innerText = MainPage.TextObject.DevTitle;
    const devItemsContainer = document.createElement('div');
    devItemsContainer.classList.add('dev-items__container');
    MainPage.TextObject.Developers.forEach((item) => {
      const devItem = document.createElement('div');
      devItem.classList.add('dev__item');
      const devImg = document.createElement('div');
      devImg.classList.add('dev__img');
      devImg.style.backgroundImage = `url(${item.img})`;
      const nameContainer = document.createElement('div');
      nameContainer.classList.add('name__container');
      const devName = document.createElement('h5');
      devName.classList.add('dev__name');
      devName.innerText = item.name;
      const devRole = document.createElement('h6');
      devRole.classList.add('dev__role');
      devRole.innerHTML = item.role;
      nameContainer.append(devName, devRole);
      const imgNameContainer = document.createElement('div');
      imgNameContainer.classList.add('dev__header');
      imgNameContainer.append(devImg, nameContainer);
      const devText = document.createElement('p');
      devText.classList.add('dev__text');
      devText.innerText = item.text;
      devItem.append(imgNameContainer, devText);
      devItemsContainer.append(devItem);
    });
    pageWrapper.append(devTitle, devItemsContainer);
    devContainer.append(pageWrapper);
    return devContainer;
  }

  render() {
    const footer = new Footer();
    this.container.append(
      this.renderMainContainer(),
      this.renderAppToolsContainer(),
      this.renderDevelopersContainer(),
      footer.renderFooter()
    );
    return this.container;
  }
}

export default MainPage;
