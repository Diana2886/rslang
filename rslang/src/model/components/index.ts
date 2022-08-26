import { IAuth, INewUser, ISignIn, IUser, IUserWord, IWord, QueryData, WordsGroup } from '../../types/index';

const baseURL = 'http://localhost:3000';
enum Path {
  words = '/words',
  users = '/users',
  signIn = '/signin',
  aggregatedWords = '/aggregatedWords',
}
export enum Result {
  success = 200,
  wrong_email_password = 422,
  exist_email = 417,
}
export default class Model {
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
      console.error(error);
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

  async createData() {
    const random = (max: number) => Math.floor(Math.random() * max) + 1;
    const newArr: IWord[] = [];
    const gameData: {
      word: IWord;
      variants: IWord[];
    }[] = [];
    const indexes: number[] = [];
    const words = await Model.getWords(1, 0);

    while (indexes.length < 20) {
      const index = random(19);
      indexes.push(index);
    }
    indexes.forEach((index) => {
      newArr.push(words[index]);
    });
    console.log(newArr);

    newArr.forEach((word) => {
      const variants: IWord[] = [];
      while (variants.length < 4) {
        const index = random(19);
        const item = words[index];
        if (!variants.includes(item) && item !== word) {
          variants.push(item);
        }
      }
      const i = random(4);
      variants.splice(i, 0, word);
      gameData.push({
        word,
        variants,
      });
    });

    const gameBody = document.createElement('div');
    gameBody.className = 'game-body';
    const audio = document.createElement('audio');
    audio.autoplay = true;
    return gameData;
  }
}
