import { IUser, IWord } from '../../types/index';

const baseURL = "http://localhost:3000"
enum Path {
  words = '/words',
}

export class Model {

  async getWords(page: number, groupNum: number): Promise<IWord[] | undefined> {
    try {
      const response = await fetch(`${baseURL}${Path.words}?page=${page}&group=${groupNum}`);
      const words = await <Promise<IWord[]>>response.json();
      return words;
    } catch (error) {
      console.error(error);
    }
  }

}
