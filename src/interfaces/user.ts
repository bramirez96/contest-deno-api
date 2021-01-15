export interface IUserSignup {
  codename: string;
  email: string;
  parentEmail: string;
  password: string;
  age: number;
  roleId: UserRoles;
}

export interface IUser {
  id: string;
  codename: string;
  email: string;
  password: string;
  parentEmail: string;
  age: number;
  isValidated: boolean;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRoles {
  user = 1,
  admin = 2,
}
