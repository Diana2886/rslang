import Component from '../../templates/components';
import PageIds from '../../../pages/app/pageIds';

const Buttons = [
  {
    id: PageIds.Main,
    text: 'Main Page',
  },
  {
    id: PageIds.Authorization,
    text: 'Authorization Page',
  },
  {
    id: PageIds.Statistics,
    text: 'Statistics Page',
  },
];

class Header extends Component {
  renderPageButtons() {
    const pageButtons = document.createElement('div');
    Buttons.forEach((button) => {
      const buttonHTML = document.createElement('a');
      buttonHTML.href = `#${button.id}`;
      buttonHTML.innerText = button.text;
      pageButtons.append(buttonHTML);
    });
    this.container.append(pageButtons);
  }

  render() {
    this.renderPageButtons();
    return this.container;
  }
}

export default Header;
