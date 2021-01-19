export interface INewReset {
  code: string;
  userId: number;
}

export interface IReset {
  id: number;
  complete: boolean;
  code: string;
  userId: number;
  createdAt: Date;
  expiresAt: Date;
}
