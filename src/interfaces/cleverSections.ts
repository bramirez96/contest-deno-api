export interface ISection extends INewSection {
  id: number;
  active: boolean;
}

export interface INewSection {
  name: string;
  subjectId: number;
  gradeId: number;
}
