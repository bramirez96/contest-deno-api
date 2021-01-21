export interface IReset extends INewReset {
  id: number;
  completed: boolean;
  createdAt: Date;
  expiresAt: Date;
}

export interface INewReset {
  code: string;
  userId: number;
}
