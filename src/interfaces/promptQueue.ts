export interface IPromptQueueItem extends INewPromptQueueItem {
  id: number;
}

export interface INewPromptQueueItem {
  promptId: number;
  startDate: Date | string;
}
