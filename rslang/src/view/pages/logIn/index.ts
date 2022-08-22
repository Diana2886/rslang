import Page from '../../core/templates/page';

class LogInPage extends Page {
  static TextObject = {
    MainTitle: 'LogIn Page',
  };

  render() {
    // const title = this.createHeaderTitle(LogInPage.TextObject.MainTitle);
    const login = this.createLoginBlock();
    this.container.append(login);
    return this.container;
  }

  createLoginBlock() {
    const loginWrapper = document.createElement('div');
    loginWrapper.className = 'login-wrapper';
    loginWrapper.innerHTML = `
    <div class="login-title-block">
      <h2>RS-School Final task</h2>
      <h5>RS-Language, this platform gave you <br> more information to learn new <br> words and good exersice and more <br> expiranse blablabla We did it!</h5>
    </div>
    <div class="login-form animate__zoomIn">
      <form class="form ">
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">E-mail address</label>
          <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="name@example.com">
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input type="password" class="form-control" id="exampleInputPassword1">
        </div>
        <div class="mb-3 d-flex justify-content-between">
          <button type="submit" class="btn btn-primary login" id="login">Login</button>
        </div>
      </form>
    </div>
    `;
    return loginWrapper;
  }
}

export default LogInPage;
