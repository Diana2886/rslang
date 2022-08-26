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

export interface IOptional {
  audio: IResult;
  sprint: IResult;
  serial: number;
}

interface IResult {
  [data: string]: {
    allGames: number;
    corrects: number;
  };
}

export interface IUserWord {
  wordId?: string;
  difficulty?: string;
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

export interface INewUser {
  id: string;
  name: string;
  email: string;
}
export interface ISignIn {
  password: string;
  email: string;
}
export interface IEmpyObj {
  [key: string]: string;
}

const optional = {
  26082022: {
    attempts: 1,
    corrects: 1,
    serial: 1,
  },
};
