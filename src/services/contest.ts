import { Service, serviceCollection, Inject } from '../../deps.ts';
import { INewVote } from '../interfaces/votes.ts';
import VoteModel from '../models/votes.ts';
import BaseService from './baseService.ts';

@Service()
export default class ContestService extends BaseService {
  constructor(@Inject(VoteModel) private voteModel: VoteModel) {
    super();
  }

  public async submitVote(subIds: number[], userId?: number) {
    try {
      const voteItem: INewVote = {
        firstPlaceId: subIds[0],
        secondPlaceId: subIds[1],
        thirdPlaceId: subIds[2],
        userId,
      };
      console.log({ subIds, voteItem });
      await this.voteModel.add(voteItem);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(ContestService);
