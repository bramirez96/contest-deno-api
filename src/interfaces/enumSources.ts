export interface ISource extends INewSource {
  id: number;
}

export interface INewSource {
  source: Sources & string;
}

export enum Sources {
  FDSC = 1,
  Rumble = 2,
  Monster = 3,
}
