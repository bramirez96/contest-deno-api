export interface ITop3 extends INewTop3 {
  id: number;
  createdAt: Date;
}

export interface INewTop3 {
  submissionId: number;
}
