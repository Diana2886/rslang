import Component from '../../templates/components';
import PageIds from '../../../pages/app/pageIds';

let navItems = [
  {
    id: PageIds.Main,
    text: 'Main',
  },
  {
    id: PageIds.Textbook,
    text: 'Textbook',
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
    id: 'logIn-page',
    text: 'Log in',
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
  static navContainer = document.createElement('div');

  renderNav() {
    const logPar = localStorage.getItem('sthmPasMail');
    const tokenUser = localStorage.getItem('newUserDataRSlang');
    const creatUser = localStorage.getItem('authDataRSlang');
    if (logPar !== null || tokenUser !== null || creatUser !== null) {
      navItems = navItems.map((item) => {
        if (item.id === PageIds.LogIn) {
          item.text = 'Log out';
          item.id = 'logOut';
          return item;
        }
        return item;
      });
    }
    const hash = window.location.hash.slice(1);
    const initialPage = hash || PageIds.Main;
    Header.navContainer.innerHTML = '';
    let template = `
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
          <a class="navbar-brand" href="#${PageIds.Main}" data-page="${PageIds.Main}">RS Lang</a>
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
            <a class="nav-link dropdown-toggle nav-target nav-games ${
              initialPage === PageIds.AudioChallenge || initialPage === PageIds.Sprint ? 'active' : ''
            }" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            ${item.text}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
        `;
        Games.forEach((game) => {
          template += `
            <li><a class="dropdown-item nav-target" href="#${game.id}" data-page="${game.id}">${game.text}</a></li>
          `;
        });
        template += `
            </ul>
          </li>
        `;
      } else if (item.id === 'logIn-page' || item.id === 'logOut') {
        template += `
        <li class="nav-item">
          <button type="button" class="btn btn-primary btn-${item.id}" data-page="${item.id}" id="login-page">${item.text}</button>
        </li>
        `;
      } else {
        template += `
          <li class="nav-item">
            <a class="nav-link nav-target ${item.id === initialPage ? 'active' : ''}" aria-current="page" href="#${
          item.id
        }" data-page="${item.id}">${item.text}</a>
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
    Header.navContainer.innerHTML = template;
    this.container.append(Header.navContainer);
  }

  render() {
    this.renderNav();
    return this.container;
  }
}

export default Header;
