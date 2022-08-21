class Footer {
  renderFooter() {
    const template = `
      <div class="footer__container">
        <div class="main-page__wrapper footer__wrapper">
          <span class="footer__item">&copy; 2022</span>
          <span class="footer__item"><a href="https://github.com/Diana2886/" class="footer__link">Diana2886</a></span>
          <span class="footer__item"><a href="https://https://github.com/aibekken/" class="footer__link">aibekken</a></span>
          <span class="footer__item"><a href="https://https://github.com/sthm23/" class="footer__link">sthm23</a></span>
          <a href="https://rs.school/js/" class="rss"></a>
        </div>
      </div>
    `;
    const footer = document.createElement('footer');
    footer.innerHTML = template;
    return footer;
  }
}

export default Footer;
