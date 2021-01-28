export interface IReset extends INewReset {
  id: number;
  completed: boolean;
  created_at: Date | string;
  expires_at: Date | string;
}

export interface INewReset {
  code: string;
  userId: number;
}
