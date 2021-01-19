export interface INewUser {
  codename: string;
  email: string;
  parentEmail: string;
  password: string;
  age: number;
  roleId: UserRoles;
}

export interface IUser {
  id: number;
  codename: string;
  email: string;
  password: string;
  parentEmail: string;
  age: number;
  isValidated: boolean;
  roleId: number;
  createdAt: Date;
  updatedAt: Date | string;
}

export type IUserFields =
  | 'id'
  | 'codename'
  | 'email'
  | 'password'
  | 'parentEmail'
  | 'age'
  | 'isValidated'
  | 'roleId'
  | 'createdAt'
  | 'updatedAt';

export enum UserRoles {
  user = 1,
  admin = 2,
}
