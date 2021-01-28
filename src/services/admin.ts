import { Service, Inject, serviceCollection, createError } from '../../deps.ts';
import { INewTop3 } from '../interfaces/top3.ts';
import FlagModel from '../models/flagModel.ts';
import PromptQueueModel from '../models/promptQueue.ts';
import PromptModel from '../models/prompts.ts';
import Top3Model from '../models/top3.ts';
import BaseService from './baseService.ts';

@Service()
export default class AdminService extends BaseService {
  constructor(
    @Inject(PromptModel) private promptModel: PromptModel,
    @Inject(PromptQueueModel) private promptQueue: PromptQueueModel,
    @Inject(Top3Model) private top3Model: Top3Model,
    @Inject(FlagModel) private flagModel: FlagModel
  ) {
    super();
  }

  public async updateActivePrompt() {
    try {
      const startDate = new Date().toISOString().split('T')[0];
      const currentPrompt = await this.promptModel.get(
        { active: true },
        { first: true }
      );
      const { promptId: newId } = await this.promptQueue.get(
        { startDate: (startDate as unknown) as Date },
        { first: true }
      );
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

  public async setTop3(ids: number[]) {
    try {
      const formattedTop3: INewTop3[] = ids.map((id) => ({
        submissionId: id,
      }));
      const top3 = await this.top3Model.get();
      return top3;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async getFlagsBySubId(submissionId: number) {
    try {
      const flags = await this.flagModel.getBySubmissionId(submissionId);
      const parsedFlags = flags.map((flag) => flag.flag);
      return parsedFlags;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async flagSubmission(submissionId: number, flagIds: number[]) {
    try {
      const flagItems = flagIds.map((flagId) => ({
        flagId,
        submissionId: submissionId,
      }));
      const flags = await this.flagModel.addFlagsToSub(flagItems);
      return flags;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(AdminService);
