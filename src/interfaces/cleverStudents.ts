import { ISubItem } from './submissions.ts';
import { IUser } from './users.ts';

export interface IStudent extends INewStudent {
  id: number;
}

export interface INewStudent {
  userId: number;
  sectionId: number;
}

export interface IStudentWithSubmissions extends IUser {
  submissions: ISubItem[];
}
