import { IAuth, IUser, IUserWord, IWord } from '../../types/index';

const baseURL = 'http://localhost:3000';
enum Path {
  words = '/words',
  users = '/users',
  signIn = '/signin',
}

export default class Model {
  async getWords(page: number, groupNum: number): Promise<IWord[]> {
    let words: IWord[] = [];
    try {
      const response = await fetch(`${baseURL}${Path.words}?page=${page}&group=${groupNum}`);
      words = await (<Promise<IWord[]>>response.json());
    } catch (error) {
      console.error(error);
    }
    return words;
  }

  async getWord(id: string): Promise<IWord | number> {
    let status = 0;
    try {
      const response = await fetch(`${baseURL}${Path.words}/${id}`);
      status = response.status;
      if (status !== 200) {
        throw new Error(`Request finish with status code: ${status}`);
      }
      const word = await (<Promise<IWord>>response.json());
      return word;
    } catch (error) {
      console.error(error);
      return status;
    }
  }

  async createUser(user: IUser): Promise<void> {
    let status = 0;
    try {
      const response = await fetch(`${baseURL}${Path.users}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      status = response.status;

      switch (status) {
        case 200:
          console.log('new user created successfully');
          break;
        case 417:
          throw new Error('user with same email already registered');
        case 422:
          throw new Error('Incorrect e-mail or password');
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async signIn(user: IUser) {
    let status = 0;
    try {
      const response = await fetch(`${baseURL}${Path.signIn}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const auth = await (<Promise<IAuth>>response.json());
      status = response.status;

      switch (status) {
        case 200:
          console.log('successful auth');
          localStorage.setItem('auth', JSON.stringify(auth));
          break;
        case 403:
          throw new Error('Incorrect e-mail or password');
        default:
          throw new Error(`request finish with status code: ${status}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async createUserWord(wordId: string, userWord: IUserWord) {
    let status = 0;
    const authStr = localStorage.getItem('auth');
    let auth: IAuth | undefined;
    if (authStr) {
      auth = <IAuth>JSON.parse(authStr);
    }
    try {
      if (!auth) throw new Error('unauthorized user');
      const response = await fetch(`${baseURL}${Path.users}/${auth.userId}${Path.words}/${wordId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userWord),
      });
      status = response.status;

      switch (status) {
        case 200:
          console.log('The user word has been created');
          break;
        case 400:
          throw new Error('Bad request');
        case 401:
          throw new Error('Access token is missing or invalid');
        case 417:
          throw new Error('user word already created');
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getUserWords() {
    let status = 0;
    const authStr = localStorage.getItem('auth');
    let auth: IAuth | undefined;
    if (authStr) {
      auth = <IAuth>JSON.parse(authStr);
    }
    try {
      if (!auth) throw new Error('unauthorized user');
      const response = await fetch(`${baseURL}${Path.users}/${auth.userId}${Path.words}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      status = response.status;
      const userWords = await (<Promise<IUserWord[]>>response.json());
      return userWords;
    } catch (error) {
      console.error(error);
      return status;
    }
  }

  async deleteUserWord(wordId: string) {
    let status = 0;
    const authStr = localStorage.getItem('auth');
    let auth: IAuth | undefined;
    if (authStr) {
      auth = <IAuth>JSON.parse(authStr);
    }
    try {
      if (!auth) throw new Error('unauthorized user');
      const response = await fetch(`${baseURL}${Path.users}/${auth.userId}${Path.words}/${wordId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      status = response.status;

      switch (status) {
        case 204:
          console.log('The user word has been deleted');
          break;
        case 400:
          throw new Error('Bad request');
        case 401:
          throw new Error('Access token is missing or invalid');
        case 417:
          throw new Error('user word not found');
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }
}
