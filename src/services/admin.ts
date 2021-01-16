import {
  Service,
  Inject,
  log,
  serviceCollection,
  createError,
} from '../../deps.ts';
import PromptModel from '../models/prompts.ts';

@Service()
export default class AdminService {
  constructor(
    @Inject(PromptModel) protected promptModel: PromptModel,
    @Inject('logger') protected logger: log.Logger
  ) {}

  public async updateActivePrompt() {
    try {
      const currentPrompt = await this.promptModel.getCurrent();
      const newPromptId = await this.promptModel.getQueuedPrompt();
      if (currentPrompt.id === newPromptId) {
        throw createError(409, 'Prompt is already up-to-date');
      }

      await Promise.all([
        this.promptModel.update(newPromptId, { active: true }),
        this.promptModel.update(currentPrompt.id, { active: false }),
      ]);
      this.logger.debug('Successfully updated active prompt');

      return newPromptId;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(AdminService);
