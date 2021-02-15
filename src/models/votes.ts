import { Service, serviceCollection } from '../../deps.ts';
import { INewVote, IVote } from '../interfaces/votes.ts';
import BaseModel from './baseModel.ts';

@Service()
export default class VoteModel extends BaseModel<INewVote, IVote> {
  constructor() {
    super('votes');
  }
}

serviceCollection.addTransient(VoteModel);
