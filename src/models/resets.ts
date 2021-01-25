import { Service, serviceCollection } from '../../deps.ts';
import { INewReset, IReset } from '../interfaces/resets.ts';
import BaseModel from './baseModel.ts';

@Service()
export default class ResetModel extends BaseModel<INewReset, IReset> {
  constructor() {
    super('resets');
  }
}

serviceCollection.addTransient(ResetModel);
