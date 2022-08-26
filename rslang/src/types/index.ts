export interface IWord {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

interface IOptional {
  [key: string]: string | boolean;
}

export interface IUserWord {
  difficulty: string;
  optional?: IOptional;
}

export interface IUser {
  name?: string;
  email: string;
  password: string;
}

export interface IAuth {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export interface ISetting {
  wordsPerDay: number;
  optional?: IOptional;
}

export interface IStatistic {
  learnedWords: number;
  optional?: IOptional;
}

export type QueryData = {
  key: string;
  value: string;
};

export type WordsGroup = { [key: string]: IWord[] };

export enum Levels {
  A1,
  A2,
  B1,
  B2,
  C1,
  C2,
}

interface IColors {
  [key: string]: string;
}

export const levelColors: IColors = {
  A1: '#198754',
  A2: '#ffc107',
  B1: '#fd7e14',
  B2: '#dc3545',
  C1: '#d63384',
  C2: '#6f42c1',
};
