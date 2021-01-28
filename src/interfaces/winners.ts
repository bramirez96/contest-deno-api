export interface IWinner extends INewWinner {
  id: number;
  created_at: Date | string;
}

export interface INewWinner {
  submissionId: number;
}
