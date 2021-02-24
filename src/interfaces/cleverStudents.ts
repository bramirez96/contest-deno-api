import { CleverGradeType } from '../../deps.ts';
import { Grades } from './enumGrades.ts';

export interface IStudent extends INewStudent {
  id: number;
}

export interface INewStudent {
  userId: number;
  sectionId: number;
  gradeId: Grades | CleverGradeType;
}
