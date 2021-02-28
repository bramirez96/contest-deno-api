export interface IPrompt extends INewPrompt {
  id: number;
  approved: boolean;
}

export interface INewPrompt {
  prompt: string;
  active: boolean;
  approved?: boolean;
  creatorId?: number;
}
