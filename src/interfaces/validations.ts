export interface IValidation extends INewValidation {
  id: number;
  createdAt: Date | string;
  completedAt?: Date | string;
}

export interface INewValidation {
  code: string;
  email: string;
  userId: number;
}
