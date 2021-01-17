export interface IValidation {
  id: number;
  code: string;
  userId: number;
  createdAt: Date;
}

export interface INewValidation {
  userId: number;
  code: string;
}
