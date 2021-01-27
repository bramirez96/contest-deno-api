import { Service, serviceCollection } from '../../deps.ts';
import { INewTop3, ITop3 } from '../interfaces/top3.ts';
import BaseModel from './baseModel.ts';

@Service()
export default class Top3Model extends BaseModel<INewTop3, ITop3> {
  constructor() {
    super('top3');
  }
}

serviceCollection.addTransient(Top3Model);
