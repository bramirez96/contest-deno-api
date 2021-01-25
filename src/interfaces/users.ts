import { DatabaseResult } from '../../deps.ts';
import { Roles } from './roles.ts';

export interface IUser extends Omit<INewUser, 'parentEmail' | 'age'> {
  id: number;
  isValidated: boolean;
  createdAt: Date;
  updatedAt: Date | string;
}

export interface INewUser {
  codename: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  roleId?: Roles;
  isValidated?: boolean;
  parentEmail?: string;
  age?: number;
}

export interface IValidationByUser extends DatabaseResult {
  validationEmail: string;
  validationId: number;
  isValidated: boolean;
  id: number;
  code: string;
}
