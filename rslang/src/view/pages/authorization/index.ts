import Page from '../../core/templates/page';

class AuthorizationPage extends Page {
  static TextObject = {
    MainTitle: 'Authorization Page',
  };

  render() {
    // const title = this.createHeaderTitle(AuthorizationPage.TextObject.MainTitle);
    const test = this.createAuthBlock();
    this.container.append(test);
    return this.container;
  }

  createAuthBlock() {
    const authWrapper = document.createElement('div');
    authWrapper.className = 'auth-wrapper';
    authWrapper.innerHTML = `
    <div class="author-title-block">
      <h2>RS-School Final task</h2>
      <h5>RS-Language, this platform gave you <br> more information to learn new <br> words and good exersice and more <br> expiranse blablabla We did it!</h5>
    </div>
    <div class="author-form">
      <form class="form">
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">E-mail address</label>
          <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="name@example.com">
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input type="password" class="form-control" id="exampleInputPassword1">
        </div>
        <div class="mb-3 d-flex justify-content-between">
          <button class="btn btn-primary login">Login</button>
          <button class="btn btn-success signin">Sign in</button>
        </div>
      </form>
    </div>
    `;
    return authWrapper;
  }
}

export default AuthorizationPage;
