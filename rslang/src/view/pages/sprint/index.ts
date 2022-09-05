import Page from '../../core/templates/page';

class Sprint extends Page {
  static TextObject = {
    MainTitle: 'Sprint Page',
  };

  render() {
    const modalWindow = this.modal();
    const sprintBlock = this.createSprintPage();
    this.container.append(sprintBlock, modalWindow);
    return this.container;
  }

  createSprintPage() {
    const wrapper = document.createElement('div');
    wrapper.className = 'sprint-wrapper';
    wrapper.innerHTML = `
    
    <div class="sprint-header">
    
      <div class="sprint-notification">

      </div>
      
    </div>
    <div class="sprint-main">
    
      <div class="check-level">
      <h2 class="sprint-main-title">
        <svg id="logo" width="250px" height="50px" viewBox="0 0 480 148" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_114_11)">
        <path d="M54.911 90.6001C54.911 88.0401 53.887 85.6081 51.839 83.3041C49.8763 81.0001 47.359 78.8667 44.287 76.9041C41.215 74.9414 37.119 72.5521 31.999 69.7361C25.6844 66.2374 20.5217 63.1654 16.511 60.5201C12.5857 57.8747 9.25768 54.8027 6.52702 51.3041C3.79635 47.8054 2.43102 43.9654 2.43102 39.7841C2.43102 35.5174 4.39368 30.9521 8.31902 26.0881C12.2444 21.1387 17.023 17.0001 22.655 13.6721C28.3723 10.2587 33.6203 8.55206 38.399 8.55206C44.1164 8.55206 50.815 9.19206 58.495 10.4721C66.175 11.7521 71.807 13.1174 75.391 14.5681V42.6001H63.359C59.775 35.6881 55.807 30.3121 51.455 26.4721C47.1883 22.6321 42.6657 20.7121 37.887 20.7121C34.4737 20.7121 31.7857 21.8214 29.823 24.0401C27.8604 26.1734 26.879 28.9041 26.879 32.2321C26.879 34.9627 27.903 37.5654 29.951 40.0401C32.0844 42.4294 34.687 44.6481 37.759 46.6961C40.9164 48.6587 45.1404 51.0907 50.431 53.9921C56.6603 57.4054 61.695 60.3921 65.535 62.9521C69.375 65.5121 72.6177 68.4987 75.263 71.9121C77.9084 75.3254 79.231 79.0801 79.231 83.1761C79.231 87.4427 77.1404 92.0507 72.959 97.0001C68.7777 101.864 63.6577 106.003 57.599 109.416C51.6257 112.744 46.1644 114.408 41.215 114.408C35.2417 114.408 28.0737 113.768 19.711 112.488C11.4337 111.208 5.46035 109.843 1.79102 108.392V80.3601H13.823C17.5777 87.2721 21.9297 92.6481 26.879 96.4881C31.8283 100.328 36.8204 102.248 41.855 102.248C45.7804 102.248 48.9377 101.139 51.327 98.9201C53.7164 96.6161 54.911 93.8427 54.911 90.6001Z" stroke="black" stroke-width="3" shape-rendering="crispEdges"/>
        <path d="M133.144 113C129.645 113 126.488 112.104 123.672 110.312V130.792L143.128 135.912L139.032 144.232H90.52V137.064L101.912 127.464V65.8961L90.52 58.7281V51.5601L117.144 40.2961L122.136 55.2721L138.136 42.4721C140.867 41.7894 143.981 41.4481 147.48 41.4481C152.685 41.4481 157.379 42.9414 161.56 45.9281C165.827 48.8294 169.112 52.8401 171.416 57.9601C173.805 63.0801 175 68.7547 175 74.9841C175 81.7254 172.824 88.0401 168.472 93.9281C164.12 99.7307 158.659 104.381 152.088 107.88C145.603 111.293 139.331 113 133.272 113H133.144ZM139.288 59.2401C136.472 59.2401 133.784 59.5814 131.224 60.2641C128.749 60.9467 126.189 62.1841 123.544 63.9761V84.2001C123.544 88.2107 124.995 91.5814 127.896 94.3121C130.883 96.9574 135.107 98.2801 140.568 98.2801C144.237 98.2801 147.011 96.8294 148.888 93.9281C150.851 91.0267 151.832 86.7601 151.832 81.1281C151.832 74.7281 150.765 69.4801 148.632 65.3841C146.499 61.2881 143.427 59.2401 139.416 59.2401H139.288Z" stroke="black" stroke-width="3" shape-rendering="crispEdges"/>
        <path d="M230.138 59.6241C227.066 59.6241 223.994 60.9894 220.922 63.7201V98.2801L240.378 103.4L236.282 111.72H187.77V104.552L199.162 94.9521V65.8961L187.77 58.7281V51.5601L214.394 40.2961L219.258 54.5041L230.906 42.4721C232.698 41.7894 234.789 41.4481 237.178 41.4481C241.615 41.4481 245.413 42.4721 248.57 44.5201C251.813 46.5681 254.074 49.3841 255.354 52.9681L243.066 68.3281H235.002C234.917 65.2561 234.49 63.0801 233.722 61.8001C232.954 60.4347 231.759 59.7521 230.138 59.7521V59.6241Z" stroke="black" stroke-width="3" shape-rendering="crispEdges"/>
        <path d="M301.093 111.72H260.645V104.552L272.037 94.9521V65.2561L260.645 57.7041V50.5361L285.733 40.2961H293.797V99.5601L305.317 103.4L301.093 111.72ZM282.789 1.76807C286.458 1.76807 289.445 2.96273 291.749 5.35207C294.138 7.65607 295.333 10.5574 295.333 14.0561C295.333 16.5307 294.48 18.8347 292.773 20.9681C291.066 23.1014 288.933 24.8081 286.373 26.0881C283.813 27.3681 281.338 28.0081 278.949 28.0081C275.365 28.0081 272.378 26.8561 269.989 24.5521C267.685 22.1627 266.533 19.2187 266.533 15.7201C266.533 13.2454 267.386 10.9414 269.093 8.80807C270.8 6.67473 272.89 4.96806 275.365 3.68806C277.925 2.40807 280.4 1.76807 282.789 1.76807Z" stroke="black" stroke-width="3" shape-rendering="crispEdges"/>
        <path d="M396.863 111.72H367.807V70.7601C367.807 66.7494 367.167 63.9334 365.887 62.3121C364.692 60.6054 362.559 59.7521 359.487 59.7521C354.964 59.7521 350.484 61.2027 346.047 64.1041V99.5601L357.567 103.4L353.343 111.72H312.895V104.552L324.287 94.9521V65.8961L312.895 58.7281V51.5601L339.519 40.2961L344.511 55.1441L360.383 42.4721C362.687 41.7894 365.29 41.4481 368.191 41.4481C374.676 41.4481 379.839 43.2401 383.679 46.8241C387.604 50.3227 389.567 55.1014 389.567 61.1601V99.5601L401.087 103.4L396.863 111.72Z" stroke="black" stroke-width="3" shape-rendering="crispEdges"/>
        <path d="M451.281 111.976C448.38 112.659 444.924 113 440.913 113C432.721 113 426.705 111.165 422.865 107.496C419.11 103.741 417.233 97.9814 417.233 90.2161V55.0161H403.409V48.2321L430.929 18.2801H438.993V46.5681H462.033V55.0161H438.993V89.3201C438.993 95.2081 442.321 98.1521 448.977 98.1521C450.684 98.1521 452.348 97.8961 453.969 97.3841C455.676 96.7867 457.809 95.8054 460.369 94.4401L464.209 101.736L451.281 111.976Z" stroke="black" stroke-width="3" shape-rendering="crispEdges"/>
        </g>
        <defs>
        <filter id="filter0_d_114_11" x="0.291016" y="0.268066" width="478.825" height="160.464" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="9" dy="11"/>
        <feGaussianBlur stdDeviation="2"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_114_11"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_114_11" result="shape"/>
        </filter>
        </defs>
        </svg>
      </h2>
      <div class="promo">
          <div>
            <svg class="first-svg animate__backInLeft" width="150px" height="200px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="#F0C932" d="M400 224h-44l-26.12-53.25c-12.5-25.5-35.38-44.25-61.75-51L197 98.63C189.5 96.84 181.1 95.97 174.5 95.97c-20.88 0-41.33 6.81-58.26 19.78L76.5 146.3C68.31 152.5 64.01 162 64.01 171.6c0 17.11 13.67 32.02 32.02 32.02c6.808 0 13.67-2.158 19.47-6.616l39.63-30.38c5.92-4.488 13.01-6.787 19.53-6.787c2.017 0 3.981 .2196 5.841 .6623l14.62 4.25l-37.5 87.5C154.1 260.3 152.5 268.8 152.5 277.2c0 22.09 11.49 43.52 31.51 55.29l85 50.13l-27.5 87.75c-.9875 3.174-1.458 6.388-1.458 9.55c0 13.65 8.757 26.31 22.46 30.58C265.6 511.5 268.9 512 272 512c13.62 0 26.25-8.75 30.5-22.5l31.75-101c1.211-4.278 1.796-8.625 1.796-12.93c0-16.57-8.661-32.51-23.55-41.44l-61.13-36.12l31.25-78.38l20.25 41.5C310.9 277.4 327.9 288 345.1 288H400c17.62 0 32-14.38 32-32C432 238.3 417.6 224 400 224zM288 96c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48S261.5 96 288 96zM129.8 317.5L114.9 352H48c-17.62 0-32 14.38-32 32s14.38 32 32 32h77.5c19.25 0 36.5-11.5 44-29.12l8.875-20.5l-10.75-6.25C150.4 349.9 137.6 334.8 129.8 317.5z"/></svg>
            <svg class="second-svg animate__backInLeft1" width="150px" height="200px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="#F0C932" d="M400 224h-44l-26.12-53.25c-12.5-25.5-35.38-44.25-61.75-51L197 98.63C189.5 96.84 181.1 95.97 174.5 95.97c-20.88 0-41.33 6.81-58.26 19.78L76.5 146.3C68.31 152.5 64.01 162 64.01 171.6c0 17.11 13.67 32.02 32.02 32.02c6.808 0 13.67-2.158 19.47-6.616l39.63-30.38c5.92-4.488 13.01-6.787 19.53-6.787c2.017 0 3.981 .2196 5.841 .6623l14.62 4.25l-37.5 87.5C154.1 260.3 152.5 268.8 152.5 277.2c0 22.09 11.49 43.52 31.51 55.29l85 50.13l-27.5 87.75c-.9875 3.174-1.458 6.388-1.458 9.55c0 13.65 8.757 26.31 22.46 30.58C265.6 511.5 268.9 512 272 512c13.62 0 26.25-8.75 30.5-22.5l31.75-101c1.211-4.278 1.796-8.625 1.796-12.93c0-16.57-8.661-32.51-23.55-41.44l-61.13-36.12l31.25-78.38l20.25 41.5C310.9 277.4 327.9 288 345.1 288H400c17.62 0 32-14.38 32-32C432 238.3 417.6 224 400 224zM288 96c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48S261.5 96 288 96zM129.8 317.5L114.9 352H48c-17.62 0-32 14.38-32 32s14.38 32 32 32h77.5c19.25 0 36.5-11.5 44-29.12l8.875-20.5l-10.75-6.25C150.4 349.9 137.6 334.8 129.8 317.5z"/></svg>
            <svg class="third-svg animate__backInLeft2" width="150px" height="200px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="#F0C932" d="M400 224h-44l-26.12-53.25c-12.5-25.5-35.38-44.25-61.75-51L197 98.63C189.5 96.84 181.1 95.97 174.5 95.97c-20.88 0-41.33 6.81-58.26 19.78L76.5 146.3C68.31 152.5 64.01 162 64.01 171.6c0 17.11 13.67 32.02 32.02 32.02c6.808 0 13.67-2.158 19.47-6.616l39.63-30.38c5.92-4.488 13.01-6.787 19.53-6.787c2.017 0 3.981 .2196 5.841 .6623l14.62 4.25l-37.5 87.5C154.1 260.3 152.5 268.8 152.5 277.2c0 22.09 11.49 43.52 31.51 55.29l85 50.13l-27.5 87.75c-.9875 3.174-1.458 6.388-1.458 9.55c0 13.65 8.757 26.31 22.46 30.58C265.6 511.5 268.9 512 272 512c13.62 0 26.25-8.75 30.5-22.5l31.75-101c1.211-4.278 1.796-8.625 1.796-12.93c0-16.57-8.661-32.51-23.55-41.44l-61.13-36.12l31.25-78.38l20.25 41.5C310.9 277.4 327.9 288 345.1 288H400c17.62 0 32-14.38 32-32C432 238.3 417.6 224 400 224zM288 96c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48S261.5 96 288 96zM129.8 317.5L114.9 352H48c-17.62 0-32 14.38-32 32s14.38 32 32 32h77.5c19.25 0 36.5-11.5 44-29.12l8.875-20.5l-10.75-6.25C150.4 349.9 137.6 334.8 129.8 317.5z"/></svg>
          </div>
          <p class="game-sprint-title">You need to choose correct or wrong answer.</p>
          <p class="game-sprint-title">You can select answers from the keyboard (right and left arrow buttons)</p>
        </div>
        <h5 class="check-level-title">
        Choose your level: 
        </h5>

        <div class="btn-group" role="group" aria-label="Базовая группа переключателей радио">          
          
          
          <input type="radio" class="btn-check btn-sm sprint-lvl-btn" name="btnradio" id="btnradio1" autocomplete="off">          
          <label class="btn btn-sm btn-outline-primary" for="btnradio1">A1</label>
          
          <input type="radio" class="btn-check btn-sm sprint-lvl-btn" name="btnradio" id="btnradio2" autocomplete="off">          
          <label class="btn btn-sm btn-outline-primary" for="btnradio2">A2</label>
          
          <input type="radio" class="btn-check btn-sm sprint-lvl-btn" name="btnradio" id="btnradio3" autocomplete="off">
          <label class="btn btn-sm btn-outline-primary" for="btnradio3">B1</label>
          
          <input type="radio" class="btn-check btn-sm sprint-lvl-btn" name="btnradio" id="btnradio4" autocomplete="off">
          <label class="btn btn-sm btn-outline-primary" for="btnradio4">B2</label>
          
          <input type="radio" class="btn-check btn-sm sprint-lvl-btn" name="btnradio" id="btnradio5" autocomplete="off">
          <label class="btn btn-sm btn-outline-primary" for="btnradio5">C1</label>
          
          <input type="radio" class="btn-check btn-sm sprint-lvl-btn" name="btnradio" id="btnradio6" autocomplete="off">
          <label class="btn btn-sm btn-outline-primary" for="btnradio6">C2</label>
        </div>
        <button type="button" class="btn btn-primary start-game" disabled>Start</button>
      </div>
      <div class="sprint-play-wrapper animate__zoomIn">
        <div class="game-info-block">
          <div class="sprint-timer"><span>60</span> sec</div>
          <div class="sprint-point">0</div>
        </div>
        <div class="game-play-block">
          <div class="time-animation-block">gives <span>+10</span> points</div>
          <div class="some-animation"> correct <span>0</span> times</div>
          <div class="task-block">
            <div class="word-sound">
              <audio src=""></audio>
            </div>
            <div class="word-english">Hello world</div>
            <div class="word-russia">Привет мир</div>
          </div>
          <div class="answer-block">
            <button type="button" class="btn btn-danger">Wrong</button>
            <button type="button" class="btn btn-success">Correct</button>
          </div>
        </div>
      </div>
    </div>
    `;
    return wrapper;
  }

  modal() {
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="modal-bg"></div>
    <div class="modal-wrapper animate__zoomIn">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Your result</h5>
       </div>
      <div class="modal-body">
        <table class="answers-table-parent">
          <h5 class="game-sprint-m-ctitle">Correct <span>0</span></h5>
          <thead>
            <tr class="thead-tr">
              <td>Sound</td>
              <td>English</td>
              <td>Russian</td>
            </tr>
          </thead>
          <tbody class="answers-table correct-answer">
            <tr>
              <td>
                <svg enable-background="new 0 0 91 91" height="25px" id="word-sound" version="1.1" viewBox="0 0 91 91"
                  width="25px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink">
                  <g>
                    <path
                      d="M4.025,33.079c0.282-0.031,0.243,7.27,0.074,10.954c-0.25,5.51-1.105,11.436-0.654,16.933   c0.404,4.934,4.519,5.317,8.58,5.362c2.753,0.031,10.481,0.035,11.479-0.234c8.647,6.077,18.8,9.523,27.329,15.801   c2.006,1.476,4.895-0.519,4.85-2.784c-0.441-22.71-1.446-45.437-0.958-68.155c0.041-1.918-2.223-3.238-3.865-2.216   c-8.727,5.424-17.556,10.639-25.764,16.808c-0.76-0.95-1.926-1.563-3.757-1.593c-5.691-0.098-11.62,0.913-17.313,1.256   C-1.074,25.518-0.935,33.64,4.025,33.079z M49.333,15.457c-0.932,19.176,0.059,38.327-0.031,57.51   c-7.274-4.67-15.243-8.229-22.019-13.654c-0.121-0.096-0.243-0.184-0.366-0.266c0.045-3.025,0.065-6.049,0.055-9.074   c-0.019-5.659-0.149-11.319-0.372-16.974c-0.055-1.442-0.073-2.983-0.302-4.378C33.736,23.851,41.586,19.714,49.333,15.457z    M19.577,31.293c0.284,2.656,0.053,5.583,0.137,8.069c0.117,3.536-0.09,18.555,0.202,20.102c-1.503-0.292-10.204,0.104-10.3,0.096   c-0.045-0.758-1.115-21.999-1.624-26.953C9.77,32.396,18.784,31.367,19.577,31.293z" />
                    <path
                      d="M65.214,69.996c-5.53,2.229-2.352,10.071,3.207,7.607c14.949-6.627,24.813-21.748,21.776-38.201   c-1.354-7.34-5.366-14.036-11.28-18.594c-2.408-1.857-5.031-3.371-7.808-4.606c-1.824-0.811-4.249-2.166-6.26-1.401   c-0.77,0.294-1.108,1.044-0.733,1.802c0.776,1.557,2.595,2.188,4.054,2.975c2.108,1.136,4.148,2.422,5.995,3.953   c4.891,4.047,8.314,9.35,9.454,15.642C86.061,52.645,77.475,65.057,65.214,69.996z" />
                  </g>
                </svg>
              </td>
              <td class="tru-eng">Hello</td>
              <td class="tru-rus">Привет</td>
            </tr>
          </tbody>
        </table>
        <table class="answers-table-parent">
          <h5 class="game-sprint-m-wtitle">Wrong <span>0</span> </h5>
          <thead>
            <tr  class="tbody-tr">
              <td>Sound</td>
              <td>English</td>
              <td>Russian</td>
            </tr>
          </thead>
          <tbody class="answers-table wrong-answer">
            <tr>
              <td>
                <svg enable-background="new 0 0 91 91" height="25px" id="word-sound" version="1.1" viewBox="0 0 91 91"
                  width="25px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink">
                  <g>
                    <path
                      d="M4.025,33.079c0.282-0.031,0.243,7.27,0.074,10.954c-0.25,5.51-1.105,11.436-0.654,16.933   c0.404,4.934,4.519,5.317,8.58,5.362c2.753,0.031,10.481,0.035,11.479-0.234c8.647,6.077,18.8,9.523,27.329,15.801   c2.006,1.476,4.895-0.519,4.85-2.784c-0.441-22.71-1.446-45.437-0.958-68.155c0.041-1.918-2.223-3.238-3.865-2.216   c-8.727,5.424-17.556,10.639-25.764,16.808c-0.76-0.95-1.926-1.563-3.757-1.593c-5.691-0.098-11.62,0.913-17.313,1.256   C-1.074,25.518-0.935,33.64,4.025,33.079z M49.333,15.457c-0.932,19.176,0.059,38.327-0.031,57.51   c-7.274-4.67-15.243-8.229-22.019-13.654c-0.121-0.096-0.243-0.184-0.366-0.266c0.045-3.025,0.065-6.049,0.055-9.074   c-0.019-5.659-0.149-11.319-0.372-16.974c-0.055-1.442-0.073-2.983-0.302-4.378C33.736,23.851,41.586,19.714,49.333,15.457z    M19.577,31.293c0.284,2.656,0.053,5.583,0.137,8.069c0.117,3.536-0.09,18.555,0.202,20.102c-1.503-0.292-10.204,0.104-10.3,0.096   c-0.045-0.758-1.115-21.999-1.624-26.953C9.77,32.396,18.784,31.367,19.577,31.293z" />
                    <path
                      d="M65.214,69.996c-5.53,2.229-2.352,10.071,3.207,7.607c14.949-6.627,24.813-21.748,21.776-38.201   c-1.354-7.34-5.366-14.036-11.28-18.594c-2.408-1.857-5.031-3.371-7.808-4.606c-1.824-0.811-4.249-2.166-6.26-1.401   c-0.77,0.294-1.108,1.044-0.733,1.802c0.776,1.557,2.595,2.188,4.054,2.975c2.108,1.136,4.148,2.422,5.995,3.953   c4.891,4.047,8.314,9.35,9.454,15.642C86.061,52.645,77.475,65.057,65.214,69.996z" />
                  </g>
                </svg>  
              </td>
              <td class="wr-eng">Hello</td>
              <td class="wr-ru">Привет</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="modal-footer">  
        <a href="#main-page" type="button" class="btn btn-secondary close-btn">Close</a>
        <button type="button" class="btn btn-primary repeat-btn">Repeat</button>
      </div>
    </div>
    `;
    return div;
  }
}

export default Sprint;
