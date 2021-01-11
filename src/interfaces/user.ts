export interface IUserSignup {
  codename: string;
  email: string;
  parentEmail: string;
  password: string;
  age: number;
}

export interface IUser {
  id: string;
  codename: string;
  email: string;
  password: string;
  parentEmail: string;
  age: number;
  createdAt: Date;
  updatedAt: Date;
}
