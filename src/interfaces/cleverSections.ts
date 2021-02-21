import { CleverGradeType, CleverSubjectType } from '../../deps.ts';
import { Grades } from './enumGrades.ts';
import { Subjects } from './enumSubjects.ts';

export interface ISection extends INewSection {
  id: number;
  active: boolean;
}

export interface INewSection {
  name: string;
  subjectId: Subjects | CleverSubjectType;
  gradeId: Grades | CleverGradeType;
}
