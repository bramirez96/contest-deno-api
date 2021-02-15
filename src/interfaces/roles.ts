export interface IRole extends INewRole {
  id: number;
}

export interface INewRole {
  role: Roles;
}

export enum Roles {
  user = 1,
  teacher = 2,
  admin = 3,
}
