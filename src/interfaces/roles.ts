export interface IRole extends INewRole {
  id: number;
}

export interface INewRole {
  role: Roles;
}

export enum Roles {
  user = 1,
  admin = 2,
  teacher = 3,
}
