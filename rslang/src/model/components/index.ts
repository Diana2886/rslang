import {
  IAggregatedWords,
  IAuth,
  ILoginInfo,
  INewUser,
  ISignIn,
  IStatistic,
  ISettings,
  IUser,
  IUserWord,
  IWord,
  QueryData,
  WordsGroup,
} from '../../types/index';

export const baseURL = 'https://learnwords-di.herokuapp.com';
enum Path {
  words = '/words',
  users = '/users',
  signIn = '/signin',
  aggregatedWords = '/aggregatedWords',
  statistics = '/statistics',
  settings = '/settings',
}
export enum Result {
  success = 200,
  wrong_email_password = 422,
  exist_email = 417,
}
class Model {
  static wordsGroup: WordsGroup = {};

  private getQueryString = (params: QueryData[]) => {
    return `?${params.map((param) => `${param.key}=${param.value}`).join('&')}`;
  };

  static async getWords(page: number, groupNum: number): Promise<IWord[]> {
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
      return status;
    }
  }

  async createUser(user: IUser): Promise<number> {
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
      const newUser = await (<Promise<INewUser>>response.json());
      status = response.status;
      if (status === Result.success) {
        localStorage.setItem('newUserDataRSlang', JSON.stringify(newUser));
        return Result.success;
      }
      return Result.wrong_email_password;
    } catch (error) {
      return Result.exist_email;
    }
  }

  async signIn(user: ISignIn): Promise<number> {
    try {
      const response = await fetch(`${baseURL}${Path.signIn}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      const { email, password } = user;
      const startDate = new Date();
      const authDataRSlang = await (<Promise<IAuth>>response.json());
      const obj = { email, password, startDate };
      localStorage.setItem('sthmPasMail', JSON.stringify(obj));
      localStorage.setItem('authDataRSlang', JSON.stringify(authDataRSlang));
      return 200;
    } catch (error) {
      return 403;
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

  async getAggregatedWords(
    filter: string,
    group?: number,
    page?: number,
    count?: number
  ): Promise<IAggregatedWords[] | number> {
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
      const words = await (<Promise<IAggregatedWords[]>>response.json());
      return words;
    } catch (error) {
      return status;
    }
  }

  async getUserWord(wordId: string) {
    let status = 0;
    const authStr = localStorage.getItem('authDataRSlang');
    let authDataRSlang: IAuth | undefined;
    if (authStr) {
      authDataRSlang = <IAuth>JSON.parse(authStr);
    }
    try {
      if (!authDataRSlang) throw new Error('unauthorized user');
      const response = await fetch(`${baseURL}${Path.users}/${authDataRSlang.userId}${Path.words}/${wordId}`, {
        headers: {
          Authorization: `Bearer ${authDataRSlang.token}`,
          'Content-Type': 'application/json',
        },
      });
      status = response.status;
      const userWord = await (<Promise<IUserWord>>response.json());
      switch (status) {
        case 200:
          return userWord;
        case 401:
          throw new Error('Access token is missing or invalid');
        case 404:
          throw new Error(`User's word not found`);
        default:
          return status;
      }
    } catch (error) {
      return status;
    }
  }

  async updateUserWord(wordId: string, userWord: IUserWord): Promise<void> {
    let status = 0;
    const authStr = localStorage.getItem('authDataRSlang');
    let authDataRSlang: IAuth | undefined;
    if (authStr) {
      authDataRSlang = <IAuth>JSON.parse(authStr);
    }
    try {
      if (!authDataRSlang) throw new Error('unauthorized user');
      const response = await fetch(`${baseURL}${Path.users}/${authDataRSlang.userId}${Path.words}/${wordId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authDataRSlang.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userWord),
      });
      status = response.status;

      switch (status) {
        case 400:
          throw new Error('Bad request');
        case 401:
          throw new Error('Access token is missing or invalid');
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getStatistic() {
    let status = 0;
    const authStr = localStorage.getItem('authDataRSlang');
    let authDataRSlang: IAuth | undefined;
    if (authStr) {
      authDataRSlang = <IAuth>JSON.parse(authStr);
    }
    try {
      if (!authDataRSlang) throw new Error('unauthorized user');
      const response = await fetch(`${baseURL}${Path.users}/${authDataRSlang.userId}${Path.statistics}`, {
        headers: {
          Authorization: `Bearer ${authDataRSlang.token}`,
          'Content-Type': 'application/json',
        },
      });
      status = response.status;
      const statistic = await (<Promise<IStatistic>>response.json());
      switch (status) {
        case 400:
          throw new Error('Access token is missing or invalid');
        case 401:
          throw new Error('Statistics not found');
        default:
          break;
      }
      return statistic;
    } catch (error) {
      return status;
    }
  }

  async updateStatistic(statistic: IStatistic): Promise<void> {
    let status = 0;
    const authStr = localStorage.getItem('authDataRSlang');
    let authDataRSlang: IAuth | undefined;
    if (authStr) {
      authDataRSlang = <IAuth>JSON.parse(authStr);
    }
    try {
      if (!authDataRSlang) throw new Error('unauthorized user');
      const response = await fetch(`${baseURL}${Path.users}/${authDataRSlang.userId}${Path.statistics}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authDataRSlang.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statistic),
      });
      status = response.status;

      switch (status) {
        case 400:
          throw new Error('Bad request');
        case 401:
          throw new Error('Access token is missing or invalid');
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getSettings() {
    let status = 0;
    const authStr = localStorage.getItem('authDataRSlang');
    let authDataRSlang: IAuth | undefined;
    if (authStr) {
      authDataRSlang = <IAuth>JSON.parse(authStr);
    }
    try {
      if (!authDataRSlang) throw new Error('unauthorized user');
      const response = await fetch(`${baseURL}${Path.users}/${authDataRSlang.userId}${Path.settings}`, {
        headers: {
          Authorization: `Bearer ${authDataRSlang.token}`,
          'Content-Type': 'application/json',
        },
      });
      status = response.status;
      const settings = await (<Promise<ISettings>>response.json());
      switch (status) {
        case 400:
          throw new Error('Access token is missing or invalid');
        case 401:
          throw new Error('Settings not found');
        default:
          break;
      }
      return settings;
    } catch (error) {
      return status;
    }
  }

  async updateSettings(settings: ISettings): Promise<void> {
    let status = 0;
    const authStr = localStorage.getItem('authDataRSlang');
    let authDataRSlang: IAuth | undefined;
    if (authStr) {
      authDataRSlang = <IAuth>JSON.parse(authStr);
    }
    try {
      if (!authDataRSlang) throw new Error('unauthorized user');
      const response = await fetch(`${baseURL}${Path.users}/${authDataRSlang.userId}${Path.settings}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authDataRSlang.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      status = response.status;

      switch (status) {
        case 400:
          throw new Error('Bad request');
        case 401:
          throw new Error('Access token is missing or invalid');
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async checkAuth() {
    const authDataRSlang = localStorage.getItem('authDataRSlang');
    const sthmPasMail = localStorage.getItem('sthmPasMail');
    if (sthmPasMail && authDataRSlang) {
      const loginInfo = <ILoginInfo>JSON.parse(sthmPasMail);
      const { startDate } = loginInfo;
      const start = new Date(startDate);
      const limit = new Date(startDate).setHours(start.getHours() + 4);
      const nowTime = +new Date();
      if (nowTime >= limit) {
        const user: ISignIn = {
          email: loginInfo.email,
          password: loginInfo.password,
        };
        await this.signIn(user);
      }
      return true;
    }
    return false;
  }
}

export default Model;
