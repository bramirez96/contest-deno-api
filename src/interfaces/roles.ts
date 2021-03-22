export interface IRole extends INewRole {
  id: number;
}

export interface INewRole {
  role: Roles & string;
}

export enum Roles {
  user = 1,
  teacher = 2,
  admin = 3,
}
