import { Service, serviceCollection } from '../../deps.ts';
import {
  INewRumbleSections,
  IRumbleSections,
} from '../interfaces/rumbleSections.ts';
import BaseModel from './baseModel.ts';

@Service()
export default class RumbleSectionsModel extends BaseModel<
  INewRumbleSections,
  IRumbleSections
> {
  constructor() {
    super('rumble_sections');
  }
}

serviceCollection.addTransient(RumbleSectionsModel);
