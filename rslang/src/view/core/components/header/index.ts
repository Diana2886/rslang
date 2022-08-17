import Component from '../../templates/components';
import PageIds from '../../../pages/app/pageIds';

const navItems = [
  {
    id: PageIds.Main,
    text: 'Main Page',
  },
  {
    id: PageIds.Textbook,
    text: 'Textbook Page',
  },
  {
    id: PageIds.WordList,
    text: 'WordList Page',
  },
  {
    id: PageIds.Games,
    text: 'Games',
  },
  {
    id: PageIds.Statistics,
    text: 'Statistics Page',
  },
  {
    id: PageIds.Authorization,
    text: 'Authorization Page',
  },
];

const Games = [
  {
    id: PageIds.AudioChallenge,
    text: 'AudioChallenge Page',
  },
  {
    id: PageIds.Sprint,
    text: 'Sprint Page',
  },
];

class Header extends Component {
  renderNav() {
    const navContainer = document.createElement('div');
    let template = `
      <nav class="navbar navbar-expand-lg bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#${PageIds.Main}">RS Lang</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
    `;
    navItems.forEach((item) => {
      if (item.id === PageIds.Games) {
        template += `
          <li class="nav-item dropdown">
            <p class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              ${item.text}
            </p>
            <ul class="dropdown-menu">
        `;
        Games.forEach((game) => {
          template += `
            <li><a class="dropdown-item" href="#${game.id}">${game.text}</a></li>
          `;
        });
        template += `
            </ul>
          </li>
        `;
      } else {
        template += `
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#${item.id}">${item.text}</a>
          </li>
      `;
      }
    });
    template += `
            </ul>
          </div>
        </div>
      </nav>
    `;
    navContainer.innerHTML = template;
    this.container.append(navContainer);
  }

  render() {
    this.renderNav();
    return this.container;
  }
}

export default Header;
