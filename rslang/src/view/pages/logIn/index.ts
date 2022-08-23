import Page from '../../core/templates/page';

class LogInPage extends Page {
  static TextObject = {
    MainTitle: 'LogIn Page',
  };

  render() {
    const modBlock = this.modal();
    document.body.append(modBlock);
    const login = this.createLoginBlock();
    this.container.append(login);
    return this.container;
  }

  createLoginBlock() {
    const loginWrapper = document.createElement('div');
    loginWrapper.className = 'login-wrapper';
    loginWrapper.innerHTML = `
    <div class="login-title-block">
      <h2 class="title login-page__title">Join our <span class="text_colored">English</span> <br> learning course!</h2>
      <h5>RS-Language, this platform gave you <br> more information to learn new <br> words and good exersice and more <br> expiranse blablabla We did it!</h5>
    </div>
    <div class="login-form animate__zoomIn">
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
          <button type="submit" class="btn btn-primary login" id="login">Log in</button>
        </div>
        
      </form>
      <hr>
      <button type="button" class="btn btn-secondary createAccountBtn" data-bs-toggle="modal" data-bs-target="#createAccountBtn">
        Create new account
      </button>
    </div>
    `;
    return loginWrapper;
  }

  modal() {
    const div = document.createElement('div');
    div.innerHTML = `
    <!-- Modal -->
    <div class="modal fade" id="createAccountBtn" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Create new account</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="create-form">
              <div class="mb-3">
                <div class="col">
                  <label for="your-name" class="form-label">Your name</label>
                  <input type="text" id="your-name" class="form-control" placeholder="First name" aria-label="Your name">
                </div>
              </div>
              <div class="mb-3">
                <label for="exampleInputEmail12" class="form-label">E-mail address</label>
                <input type="email" class="form-control" id="exampleInputEmail12" aria-describedby="emailHelp" placeholder="name@example.com">
              </div>
              <div class="mb-3">
                <label for="exampleInputPassword12" class="form-label">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword12" placeholder="your name">
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary">Create</button>
              </div>        
            </form>
          </div>

        </div>
      </div>
    </div>
    `;
    return div;
  }
}

export default LogInPage;
