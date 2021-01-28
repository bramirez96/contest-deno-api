export interface ITop3 extends INewTop3 {
  id: number;
  created_at: Date | string;
}

export interface INewTop3 {
  submissionId: number;
}
