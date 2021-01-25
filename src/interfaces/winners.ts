export interface IWinner extends INewWinner {
  id: number;
  createdAt: Date;
}

export interface INewWinner {
  submissionId: number;
}
