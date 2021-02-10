import { moment } from '../../deps.ts';

export interface IPromptQueueItem extends INewPromptQueueItem {
  id: number;
}

export interface INewPromptQueueItem {
  promptId: number;
  starts_at: Date;
}
