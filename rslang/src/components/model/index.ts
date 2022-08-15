import { IAuth, IUser, IUserWord, IWord, QueryData, WordsGroup } from '../../types/index';

const baseURL = 'http://localhost:3000';
enum Path {
  words = '/words',
  users = '/users',
  signIn = '/signin',
  aggregatedWords = '/aggregatedWords',
}

export default class Model {
  wordsGroup: WordsGroup = {};

  private getQueryString = (params: QueryData[]) => {
    return `?${params.map((param) => `${param.key}=${param.value}`).join('&')}`;
  };

  async getWords(page: number, groupNum: number): Promise<IWord[]> {
    let words: IWord[] = [];
    if (this.wordsGroup[`p${page}g${groupNum}`]) {
      words = this.wordsGroup[`p${page}g${groupNum}`];
    } else {
      try {
        const response = await fetch(`${baseURL}${Path.words}?page=${page}&group=${groupNum}`);
        words = await (<Promise<IWord[]>>response.json());
        this.wordsGroup[`p${page}g${groupNum}`] = words;
      } catch (error) {
        console.error(error);
      }
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

  async signIn(user: IUser): Promise<void> {
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

      const authDataRSlang = await (<Promise<IAuth>>response.json());
      status = response.status;

      switch (status) {
        case 200:
          console.log('successful authDataRSlang');
          localStorage.setItem('authDataRSlang', JSON.stringify(authDataRSlang));
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

  async createUserWord(wordId: string, userWord: IUserWord): Promise<void> {
    let status = 0;
    const authStr = localStorage.getItem('authDataRSlang');
    let authDataRSlang: IAuth | undefined;
    if (authStr) {
      authDataRSlang = <IAuth>JSON.parse(authStr);
    }
    try {
      if (!authDataRSlang) throw new Error('unauthorized user');
      const response = await fetch(`${baseURL}${Path.users}/${authDataRSlang.userId}${Path.words}/${wordId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authDataRSlang.token}`,
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
    const authStr = localStorage.getItem('authDataRSlang');
    let authDataRSlang: IAuth | undefined;
    if (authStr) {
      authDataRSlang = <IAuth>JSON.parse(authStr);
    }
    try {
      if (!authDataRSlang) throw new Error('unauthorized user');
      const response = await fetch(`${baseURL}${Path.users}/${authDataRSlang.userId}${Path.words}`, {
        headers: {
          Authorization: `Bearer ${authDataRSlang.token}`,
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

  async deleteUserWord(wordId: string): Promise<void> {
    let status = 0;
    const authStr = localStorage.getItem('authDataRSlang');
    let authDataRSlang: IAuth | undefined;
    if (authStr) {
      authDataRSlang = <IAuth>JSON.parse(authStr);
    }
    try {
      if (!authDataRSlang) throw new Error('unauthorized user');
      const response = await fetch(`${baseURL}${Path.users}/${authDataRSlang.userId}${Path.words}/${wordId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authDataRSlang.token}`,
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

  async getAggregatedWords(filter: string, group?: number, page?: number, count?: number): Promise<IWord[] | number> {
    let status = 0;
    const authStr = localStorage.getItem('authDataRSlang');
    let authDataRSlang: IAuth | undefined;
    if (authStr) {
      authDataRSlang = <IAuth>JSON.parse(authStr);
    }
    try {
      if (!authDataRSlang) throw new Error('unauthorized user');
      const queryParams: QueryData[] = [];
      if (group !== undefined) {
        queryParams.push({ key: 'group', value: `${group}` });
      }
      if (page !== undefined) {
        queryParams.push({ key: 'page', value: `${page}` });
      }
      if (count !== undefined) {
        queryParams.push({ key: 'wordsPerPage', value: `${count}` });
      }
      queryParams.push({ key: 'filter', value: `${filter}` });
      const response = await fetch(
        `${baseURL}${Path.users}/${authDataRSlang.userId}${Path.aggregatedWords}${this.getQueryString(queryParams)}`,
        {
          headers: {
            Authorization: `Bearer ${authDataRSlang.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      status = response.status;
      const words = await (<Promise<IWord[]>>response.json());
      return words;
    } catch (error) {
      console.error(error);
      return status;
    }
  }
}
