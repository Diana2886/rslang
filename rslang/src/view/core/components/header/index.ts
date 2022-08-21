import Component from '../../templates/components';
import PageIds from '../../../pages/app/pageIds';

const navItems = [
  {
    id: PageIds.Main,
    text: 'Main',
  },
  {
    id: PageIds.Textbook,
    text: 'Textbook',
  },
  {
    id: PageIds.WordList,
    text: 'WordList',
  },
  {
    id: PageIds.Games,
    text: 'Games',
  },
  {
    id: PageIds.Statistics,
    text: 'Statistics',
  },
  {
    id: PageIds.LogIn,
    text: 'Log in',
  },
  {
    id: PageIds.SignUp,
    text: 'Sign up',
  },
];

const Games = [
  {
    id: PageIds.AudioChallenge,
    text: 'Audio Challenge',
  },
  {
    id: PageIds.Sprint,
    text: 'Sprint',
  },
];

class Header extends Component {
  renderNav() {
    const navContainer = document.createElement('div');
    let template = `
      <nav class="navbar navbar-expand-lg">
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
            <a class="nav-link dropdown-toggle nav-target" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            ${item.text}
            </a>
            <ul class="dropdown-menu">
        `;
        Games.forEach((game) => {
          template += `
            <li><a class="dropdown-item nav-target nav-games" href="#${game.id}">${game.text}</a></li>
          `;
        });
        template += `
            </ul>
          </li>
        `;
      } else if (item.id === PageIds.SignUp || item.id === PageIds.LogIn) {
        template += `
          <li class="nav-item">
            <a class="nav-link nav-target" aria-current="page" href="#${item.id}">
              <button type="button" class="btn btn-primary btn-${item.id}">${item.text}</button>
            </a>
          </li>
        `;
      } else {
        template += `
          <li class="nav-item">
            <a class="nav-link nav-target ${item.id === PageIds.Main ? 'active' : ''}" aria-current="page" href="#${
          item.id
        }">${item.text}</a>
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
