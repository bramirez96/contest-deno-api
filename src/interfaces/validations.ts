export interface IValidation extends INewValidation {
  id: number;
  created_at: Date | string;
  completed_at?: Date | string;
}

export interface INewValidation {
  code: string;
  email: string;
  userId: number;
}
