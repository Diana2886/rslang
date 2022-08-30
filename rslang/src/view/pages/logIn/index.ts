import Page from '../../core/templates/page';

class LogInPage extends Page {
  static TextObject = {
    MainTitle: 'LogIn Page',
  };

  // render() {
  //   return this.container;
  // }

  static authModal() {
    document.body.classList.add('body-act');
    const div = document.createElement('div');
    div.className = 'modal-loginPage-box';
    div.innerHTML = `
    <div class="login-modal zoomIn modal-active">
    <div class="login-block">
      <button type="button" class="btn-close close-modal"></button>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">E-mail address</label>
        <input type="email" class="form-control" id="login-email" aria-describedby="emailHelp" placeholder="name@example.com">
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">Password</label>
        <input type="password" class="form-control" id="login-password" placeholder="more 8 characters">
      </div>
      
      <div class="login-btn-box">
        <button type="button" class="btn btn-primary login" id="login">Log in</button>
        <div id="error-alert"></div>
      </div>
      <hr>
    </div>
    <button type="button" class="btn btn-secondary createUser" id="createUser">Create new user</button>
    
  </div>


  <div class="register-modal zoomIn">
    <button type="button" class="btn-close close-modal"></button>
    <div class="mb-3">
      <label for="register-name" class="form-label">First name</label>
      <input type="text" class="form-control" id="register-name" aria-describedby="emailHelp" placeholder="First name">
    </div>
    <div class="mb-3">
      <label for="register-email" class="form-label">E-mail address</label>
      <input type="email" class="form-control" id="register-email" aria-describedby="emailHelp" placeholder="name@example.com">
    </div>
    <div class="mb-3">
      <label for="register-password" class="form-label">Password</label>
      <input type="password" class="form-control" id="register-password" placeholder="more 8 characters">
    </div>
    
    <div class="mb-3 register-bnt-box">
      <button type="button" class="btn btn-primary register" id="register">Create</button>
      <button type="button" class="btn btn-dark back-login" id="back-login">Back to login</button>
      <div id="error-alert2"></div>
    </div>
  </div>


  <div class="auth-modal-bg fadeIn black-bg"></div>
    `;
    return div;
  }
}

export default LogInPage;
