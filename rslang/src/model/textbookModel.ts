class TextbookModel {
  static group = Number(localStorage.getItem('group'));

  static page = Number(localStorage.getItem('page'));

  static setLocalStorageSettings(): void {
    const setLocalStorage = (): void => {
      localStorage.setItem('group', `${TextbookModel.group}`);
      localStorage.setItem('page', `${TextbookModel.page}`);
    };
    window.addEventListener('beforeunload', setLocalStorage);

    const getLocalStorage = (): void => {
      if (localStorage.getItem('group')) {
        TextbookModel.group = +(localStorage.getItem('group') as string);
      }
      if (localStorage.getItem('page')) {
        TextbookModel.page = +(localStorage.getItem('page') as string);
      }
    };
    window.addEventListener('DOMContentLoaded', getLocalStorage);
  }
}

export default TextbookModel;
