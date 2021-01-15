export interface IValidation {
  id: number;
  code: string;
  userId: number;
  createdAt: Date;
}

export interface INewValidationEntry {
  userId: number;
  code: string;
}
