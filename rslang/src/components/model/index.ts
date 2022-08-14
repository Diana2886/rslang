import { IUser, IWord } from '../../types/index';

const baseURL = 'http://localhost:3000';
enum Path {
  words = '/words',
  users = '/users',
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
}
