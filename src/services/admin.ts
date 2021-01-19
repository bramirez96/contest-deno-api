import {
  Service,
  Inject,
  log,
  serviceCollection,
  createError,
  Manager,
  Adapter,
} from '../../deps.ts';
import PromptQueueModel from '../models/promptQueue.ts';
import PromptModel from '../models/prompts.ts';
import BaseService from './baseService.ts';
// import PromptModel from '../models/prompts.ts';

@Service()
export default class AdminService extends BaseService {
  constructor(
    @Inject(PromptModel) private promptModel: PromptModel,
    @Inject(PromptQueueModel) private promptQueue: PromptQueueModel,
    @Inject('logger') protected logger: log.Logger
  ) {
    super();
  }

  public async updateActivePrompt() {
    try {
      const startDate = new Date().toISOString().split('T')[0];
      console.log({ startDate });
      const currentPrompt = await this.promptModel.getOne({ active: true });
      const { promptId: newId } = await this.promptQueue.getOne({ startDate });
      if (currentPrompt.id === newId) {
        throw createError(409, 'Prompt is already up-to-date');
      }
      const curHour = parseInt(new Date().toISOString().split('T')[1], 10);
      if (curHour < 1 || curHour > 22) {
        this.logger.debug('Could not update at this time');
        throw createError(409, 'Could not update at this time');
      }

      await this.db.transaction(async () => {
        await this.promptModel.update(newId, { active: true });
        await this.promptModel.update(currentPrompt.id, { active: false });
      });
      this.logger.debug('Successfully updated active prompt');

      return newId;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(AdminService);
