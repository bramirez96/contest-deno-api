import { moment, Q, Service, serviceCollection } from '../../deps.ts';
import { INewPrompt, IPrompt, IPromptInQueue } from '../interfaces/prompts.ts';
import BaseModel from './baseModel.ts';

@Service()
export default class PromptModel extends BaseModel<INewPrompt, IPrompt> {
  constructor() {
    super('prompts');
  }

  public async getUpcoming() {
    try {
      const prompts = ((await this.db
        .table('prompt_queue')
        .innerJoin('prompts', 'prompts.id', 'prompt_queue.promptId')
        .limit(7)
        .where('prompt_queue.starts_at', Q.gte(moment.utc().format()))
        .select('prompts.*', 'prompt_queue.starts_at')
        .execute()) as unknown[]) as IPromptInQueue[];

      return prompts;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(PromptModel);
