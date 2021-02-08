import { Service, serviceCollection, Inject, Q } from '../../deps.ts';
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
      await this.voteModel.add(voteItem);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async getLeaderboard() {
    const today = new Date();
    const daysAgo = 7;
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - daysAgo);
    fromDate.setUTCHours(0);
    fromDate.setUTCMinutes(0);
    fromDate.setUTCSeconds(0);
    fromDate.setUTCMilliseconds(0);

    const query = `SELECT "users"."id", "users"."codename",
      SUM("submissions"."score") AS score 
      FROM "submissions" 
      INNER JOIN "users" ON "users"."id" = "submissions"."userId" 
      WHERE "submissions"."created_at" >= '${fromDate.toUTCString()}'
      GROUP BY "users"."id" 
      ORDER BY score DESC LIMIT 10;`.replace(/\s\s+/g, ' '); // Replace all whitespace with a single space
    const subs = await this.db.query(query);
    return subs;
  }
}

serviceCollection.addTransient(ContestService);
