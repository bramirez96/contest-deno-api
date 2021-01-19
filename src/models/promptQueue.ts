import { Service, serviceCollection } from '../../deps.ts';
import {
  INewPromptQueueItem,
  IPromptQueueItem,
} from '../interfaces/prompts.ts';
import BaseModel from './baseModel.ts';

@Service()
export default class PromptQueueModel extends BaseModel<
  INewPromptQueueItem,
  IPromptQueueItem
> {
  constructor() {
    super('prompt_queue');
  }
}

serviceCollection.addTransient(PromptQueueModel);
