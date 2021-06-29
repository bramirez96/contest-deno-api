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
      // Return early if we already have the active prompt
      if (prompts.some((p) => p.active)) return prompts;

      const [currentPrompt] = ((await this.db
        .table('prompt_queue')
        .innerJoin('prompts', 'prompts.id', 'prompt_queue.promptId')
        .where('prompts.active', true)
        .select('prompts.*', 'prompt_queue.starts_at')
        .execute()) as unknown[]) as IPromptInQueue[];

      return [currentPrompt, ...prompts];
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(PromptModel);
