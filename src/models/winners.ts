import { Service, serviceCollection } from '../../deps.ts';
import { INewWinner, IWinner } from '../interfaces/winners.ts';
import BaseModel from './baseModel.ts';

@Service()
export default class WinnerModel extends BaseModel<INewWinner, IWinner> {
  constructor() {
    super('winners');
  }
}

serviceCollection.addTransient(WinnerModel);
