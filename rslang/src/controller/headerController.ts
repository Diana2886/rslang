class HeaderController {
  listenHeaderButtons() {
    (document.querySelector('.navbar-nav') as HTMLElement).addEventListener('click', (e) => {
      const target = e.target as HTMLButtonElement;
      if (target.classList.contains('nav-target')) {
        const navElements = document.querySelectorAll('.nav-target');
        navElements.forEach((item) => {
          (item as HTMLElement).classList.remove('active');
        });
        target.classList.add('active');
        if (target.innerText === 'Audio Challenge' || target.innerText === 'Sprint') {
          (document.querySelector('.nav-games') as HTMLElement).classList.add('active');
        }
      }
    });
  }
}

export default HeaderController;
