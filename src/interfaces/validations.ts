export interface IValidation extends INewValidation {
  id: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface INewValidation {
  code: string;
  email: string;
  userId: number;
}
