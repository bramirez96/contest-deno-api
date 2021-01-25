import { Service, serviceCollection } from '../../deps.ts';
import { IPrompt, INewPrompt } from '../interfaces/prompts.ts';
import BaseModel from './baseModel.ts';

@Service()
export default class PromptModel extends BaseModel<INewPrompt, IPrompt> {
  constructor() {
    super('prompts');
  }
}

serviceCollection.addTransient(PromptModel);
