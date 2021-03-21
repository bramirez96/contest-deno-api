import { CleverGradeType, CleverSubjectType } from '../../deps.ts';
import { Grades } from './enumGrades.ts';
import { Subjects } from './enumSubjects.ts';
import { IRumbleWithSectionInfo } from './rumbles.ts';

export interface ISectionWithRumbles extends ISection {
  rumbles: IRumbleWithSectionInfo[];
}
export interface ISection extends INewSection {
  id: number;
}

export interface INewSection extends ISectionPostBody {
  active: boolean;
  joinCode: string;
}

export interface ISectionPostBody {
  name: string;
  subjectId: Subjects | CleverSubjectType;
  gradeId: Grades | CleverGradeType;
}
