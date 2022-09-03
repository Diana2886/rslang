export interface IWord {
  id: string;
  _id?: string;
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

export interface IAggregatedWords {
  paginatedResults: IWord[];
  totalCount: 'object';
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

export interface IStatOptional {
  [date: string]: {
    audio: {
      newWords: number;
      learnedWords: number;
      series: number;
      bestSeries: number;
    };
    sprint: {
      newWords: number;
      learnedWords: number;
      series: number;
      bestSeries: number;
    };
    textbook: {
      newWords: number;
      learnedWords: number;
      series: number;
      bestSeries: number;
    };
  };
}

export interface IStatistic {
  learnedWords: number;
  optional: IStatOptional;
}

export interface IStatData {
  allLearned: number;
  common: {
    learned: number;
    newWords: number;
    winsPercent: number | false;
  };
  audio: {
    learned: number;
    newWords: number;
    winsPercent: number | false;
    bestSeries: number;
  };
  sprint: {
    learned: number;
    newWords: number;
    winsPercent: number | false;
    bestSeries: number;
  };
  textbook: {
    learned: number;
    newWords: number;
  };
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

export type GameData = {
  word: IWord;
  variants: IWord[];
};

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

export enum LevelColors {
  '#198754',
  '#ffc107',
  '#fd7e14',
  '#dc3545',
  '#d63384',
  '#6f42c1',
}

export const difficultyColors: IColors = {
  difficult: '#DDDEFA',
  learned: '#FCF4D6',
};

export interface IChartData {
  date: Date;
  value: number;
}

export interface ILoginInfo {
  email: string;
  password: string;
  startDate: Date;
}