export interface IStudent extends INewStudent {
  id: number;
}

export interface INewStudent {
  userId: number;
  sectionId: number;
  gradeId: number;
}
