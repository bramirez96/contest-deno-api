export interface IPrompt extends INewPrompt {
  id: number;
}

export interface INewPrompt {
  prompt: string;
  active: boolean;
}
