export interface IPrompt {
  id: number;
  prompt: string;
  active: boolean;
}

export interface INewPrompt {
  prompt: string;
  active: boolean;
}

export interface IPromptQueueItem {
  id: number;
  promptId: number;
  startDate: Date | string;
}

export interface INewPromptQueueItem {
  promptId: number;
  startDate: Date | string;
}
