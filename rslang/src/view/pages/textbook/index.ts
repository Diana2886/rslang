import TextbookModel from '../../../model/textbookModel';
import Model, { baseURL } from '../../../model/components/index';
import Page from '../../core/templates/page';
import PageIds from '../app/pageIds';
import { difficultyColors, ISettingsOptional, IWord, LevelColors, Levels } from '../../../types/index';
import Footer from '../../core/components/footer/index';
import AudioGame from '../audioChallenge/audioChallenge';

class TextbookPage extends Page {
  static TextObject = {
    MainTitle: 'Textbook',
  };

  model = new Model();

  textbookModel = new TextbookModel();

  async renderWords(words: IWord[]) {
    const wordsContainer = document.createElement('div');
    wordsContainer.classList.add('words__container');
    const wordsWrapper = document.createElement('div');
    wordsWrapper.classList.add('words__wrapper');
    let allGamesStatistics: number;
    let correctAnswersStatistics: number;
    if (!this.textbookModel.checkAuthorization()) {
      TextbookModel.settings.optional = {
        translationCheck: true,
        wordButtonsCheck: true,
      };
    } else {
      await this.textbookModel.getSettings();
    }
    const isTranslationDisplayed = (key: keyof ISettingsOptional) => {
      return TextbookModel.settings.optional[key] ? 'block' : 'none';
    };
    words.forEach((item) => {
      const imgPath = `${baseURL}/${item.image}`;
      const wordContainer = document.createElement('div');
      wordContainer.classList.add('word__container');
      wordContainer.id = `word-id-${TextbookModel.getWordId(item)}`;
      wordContainer.style.boxShadow = `0px 8px 8px ${LevelColors[item.group]}30`;
      if (typeof TextbookModel.userWords === 'object') {
        TextbookModel.userWords.forEach((el) => {
          if (el.wordId === item.id) {
            wordContainer.style.backgroundColor = difficultyColors[el.difficulty as string];
          }
        });
      }
      (async () => {
        allGamesStatistics = (await this.textbookModel.getStatisticsForTextbookWord(item.id)).allGames;
        correctAnswersStatistics = (await this.textbookModel.getStatisticsForTextbookWord(item.id)).correctAnswers;
        const incorrectAnswers = allGamesStatistics - correctAnswersStatistics;
        const template = `
            <img class="word__img" src="${imgPath}" alt="image">
            <div class="word__content">
              <div class word-text__wrapper>
                <div class="word-translation__wrapper" style="border-left: 3px solid ${LevelColors[item.group]}">
                  <div class="word__wrapper">
                    <h4 class="word">${item.word}</h4>
                    <h5 class="transcription">${item.transcription}</h5>
                    <span class="word__play" id="${TextbookModel.getWordId(item)}"></span>
                  </div>
                  <p class="translation" style="display:${isTranslationDisplayed('translationCheck')}">${
          item.wordTranslate
        }</p>
                </div>
                <div class="phrase__wrapper phrase-meaning__wrapper">
                  <p class="phrase phrase-en_meaning">${item.textMeaning}</p>
                  <p class="phrase phrase-ru phrase-ru_meaning" style="display:${isTranslationDisplayed(
                    'translationCheck'
                  )}">${item.textMeaningTranslate}</p>
                </div>
                <div class="phrase__wrapper phrase-example__wrapper">
                  <p class="phrase phrase-en_example">${item.textExample}</p>
                  <p class="phrase phrase-ru phrase-ru_example" style="display:${isTranslationDisplayed(
                    'translationCheck'
                  )}">${item.textExampleTranslate}</p>
                </div>
              </div>
              <div class="word-buttons-stat__container">
                <div class="word__buttons" style="display: ${
                  this.textbookModel.checkAuthorization() ? 'flex' : 'none'
                }">
                  <button class="btn btn-primary difficult-button" style="display:${isTranslationDisplayed(
                    'wordButtonsCheck'
                  )}">${TextbookModel.isDifficultWordsGroup ? 'remove' : 'difficult'}</button>
                  ${
                    !TextbookModel.isDifficultWordsGroup
                      ? `<button class="btn btn-secondary learned-button" style="display:${isTranslationDisplayed(
                          'wordButtonsCheck'
                        )}">learned</button>`
                      : ''
                  }
                </div>
                ${
                  this.textbookModel.isUserWordExist(item.id) && allGamesStatistics !== 0
                    ? `
                  <div class="word-games-stat__container">
                    <p class="word-games-stat">Correct answers: ${correctAnswersStatistics}</p>
                    <p class="word-games-stat">Incorrect answers: ${incorrectAnswers >= 0 ? incorrectAnswers : 0}</p>
                  </div>
                `
                    : ''
                }
              </div>
            </div>
          `;
        wordContainer.innerHTML = template;
        wordsContainer.append(wordContainer);
      })().catch((err: Error) => console.warn(err.message));
    });
    wordsWrapper.append(wordsContainer);
    const footer = new Footer();
    this.container.append(wordsWrapper, footer.renderFooter());
    return wordsContainer;
  }

  renderLevelsElement() {
    const GROUPS_AMOUNT = 6;
    const levelsElement = document.createElement('div');
    levelsElement.classList.add('dropdown', 'levels__dropdown');
    let template = `
      <button class="btn btn-secondary dropdown-toggle dropdown-groups levels-btn" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
        Level ${Levels[TextbookModel.group]}
      </button>
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenu2">
    `;
    for (let i = 0; i < GROUPS_AMOUNT; i += 1) {
      template += `
        <li><button class="dropdown-item level__item" id="level${i + 1}" type="button" style="background-color:${
        LevelColors[i]
      }">${Levels[i]}</button></li>
      `;
    }
    template += '</ul>';
    levelsElement.innerHTML = template;
    return levelsElement;
  }

  renderPaginationElement() {
    const paginationElement = document.createElement('div');
    paginationElement.classList.add('pagination');
    let template = `
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item">
            <button class="btn btn-secondary page-link page-prev" type="button" aria-label="Previous">
              <span aria-hidden="true">&lt;</span>
            </button>
          </li>
          <li class="page-item"><button class="btn btn-secondary dropdown-toggle dropdown-groups pages-btn" type="button" id="dropdownMenu3" data-bs-toggle="dropdown" aria-expanded="false">
            Page ${TextbookModel.page + 1}
          </button>
          <ul class="dropdown-menu dropdown-pages dropdown-menu-end" aria-labelledby="dropdownMenu2">
    `;
    for (let i = 0; i < TextbookModel.PAGES_AMOUNT; i += 1) {
      template += `
        <li><button class="dropdown-item page__item page${i + 1}" id="page${i + 1}" type="button">Page ${
        i + 1
      }</button></li>
      `;
    }
    template += `
          </ul>
          <li class="page-item">
            <button class="btn btn-secondary page-link page-next" type="button" aria-label="Next">
              <span aria-hidden="true">&gt;</span>
            </button>
          </li>
        </ul>
      </nav>
    `;
    paginationElement.innerHTML = template;
    return paginationElement;
  }

  renderGamesButton() {
    const template = `
      <button class="btn btn-secondary dropdown-toggle textbook-games__button" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Games
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li><a class="dropdown-item textbook__audio-challenge" href="#">Audio Challenge</a></li>
        <li><a class="dropdown-item" href="#${PageIds.Sprint}">Sprint</a></li>
      </ul>
    `;
    const gamesDropdown = document.createElement('div');
    gamesDropdown.classList.add('dropdown', 'textbook-tools__games');
    gamesDropdown.innerHTML = template;
    const audioBtn = gamesDropdown.querySelector('.textbook__audio-challenge');
    audioBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '#audioChallenge-page';
      const audioGame = new AudioGame(new Model());
      const title = 'Audio Challenge';
      const description = 'Listen these words and choose the correct translation';

      const { modal, buttonStart } = this.renderModalAudio(title, description);

      setTimeout(() => {
        const greetBlock = document.querySelector('.greetBlock');
        if (greetBlock) {
          greetBlock.innerHTML = '';
          greetBlock.append(modal);
          buttonStart.addEventListener('click', () => {
            buttonStart.disabled = true;
            audioGame
              .startGame(TextbookModel.group, TextbookModel.page)
              .then((element) => {
                greetBlock.innerHTML = '';
                greetBlock?.append(element);
              })
              .catch((err) => console.error(err));
          });
        }
      });
    });
    return gamesDropdown;
  }

  renderDifficultWordsButton() {
    const template = `<button type="button" class="btn btn-primary btn-difficult-words">Difficult words</button>`;
    const difficultWordsButton = document.createElement('div');
    difficultWordsButton.innerHTML = template;
    return difficultWordsButton;
  }

  renderSettingsButton() {
    const isCheckboxChecked = (key: keyof ISettingsOptional) => {
      return TextbookModel.settings.optional[key] ? 'checked' : '';
    };
    const template = `
    <button type="button" class="btn btn-primary btn-settings" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Settings
    </button>
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-settings modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Settings</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="translationCheck" ${isCheckboxChecked(
                'translationCheck'
              )}>
              <label class="form-check-label" for="translationCheck">
                Display translation
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="wordButtonsCheck" ${isCheckboxChecked(
                'wordButtonsCheck'
              )}>
              <label class="form-check-label" for="wordButtonsCheck">
                Show action buttons for words
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;
    const settingsButton = document.createElement('div');
    settingsButton.innerHTML = template;
    return settingsButton;
  }

  renderModalAudio(title: string, description: string) {
    const modal = document.createElement('div');
    modal.className = 'audio-call__modal';
    const titleText = document.createElement('h4');
    titleText.textContent = title;
    const descriptionText = document.createElement('p');
    descriptionText.textContent = description;
    const buttonStart = document.createElement('button');
    buttonStart.className = 'modal__start-audio btn btn-primary';
    buttonStart.textContent = 'Start';
    [titleText, descriptionText, buttonStart].forEach((item) => modal.append(item));
    return { modal, buttonStart };
  }

  renderTextbookToolsContainer() {
    const textbookToolsContainer = document.createElement('div');
    textbookToolsContainer.classList.add('textbook-tools__container');
    const textbookToolsMainContainer = document.createElement('div');
    textbookToolsMainContainer.classList.add('textbook-tools-main__container');
    textbookToolsMainContainer.append(
      this.renderLevelsElement(),
      this.renderPaginationElement(),
      this.renderGamesButton()
    );
    const textbookToolsAdditionContainer = document.createElement('div');
    textbookToolsAdditionContainer.classList.add('textbook-tools-addition__container');
    if (this.textbookModel.checkAuthorization())
      textbookToolsAdditionContainer.append(this.renderDifficultWordsButton(), this.renderSettingsButton());
    textbookToolsContainer.append(textbookToolsMainContainer, textbookToolsAdditionContainer);
    return textbookToolsContainer;
  }

  renderTextbookContainer() {
    const textbookContainer = document.createElement('div');
    textbookContainer.classList.add('textbook__container');
    const title = this.createHeaderTitle(TextbookPage.TextObject.MainTitle);
    textbookContainer.append(title, this.renderTextbookToolsContainer());
    return textbookContainer;
  }

  render() {
    (async () => {
      if (this.textbookModel.checkAuthorization()) {
        await this.textbookModel.getSettings();
      }
      this.container.append(this.renderTextbookContainer());
      const words = await Model.getWords(TextbookModel.page, TextbookModel.group);
      const difficultWords = await this.textbookModel.getDifficultWords();
      await this.renderWords(TextbookModel.isDifficultWordsGroup ? difficultWords : words);
      if (TextbookModel.isDifficultWordsGroup) this.textbookModel.setDifficultWordsPage();
      const textbookModel = new TextbookModel();
      textbookModel.updatePaginationState();
      await textbookModel.checkPageStyle();
    })().catch((err: Error) => console.warn(err.message));
    return this.container;
  }
}

export default TextbookPage;
