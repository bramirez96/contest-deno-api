import { Service, serviceCollection } from '../../deps.ts';
import { INewRumble, IRumble } from '../interfaces/rumbles.ts';
import BaseModel from './baseModel.ts';

@Service()
export default class RumbleModel extends BaseModel<INewRumble, IRumble> {
  constructor() {
    super('rumbles');
  }
}

serviceCollection.addTransient(RumbleModel);
