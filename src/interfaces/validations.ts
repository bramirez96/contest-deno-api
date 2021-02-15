export interface IValidation extends INewValidation {
  id: number;
  created_at: Date;
  completed_at?: Date;
}

export interface INewValidation {
  code: string;
  email: string;
  userId: number;
}
