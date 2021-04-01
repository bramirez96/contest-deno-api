import { Service, serviceCollection } from '../../deps.ts';
import {
  INewRumbleFeedback,
  IRumbleFeedback,
} from '../interfaces/rumbleFeedback.ts';
import BaseModel from './baseModel.ts';

@Service()
export default class RumbleFeedbackModel extends BaseModel<
  INewRumbleFeedback,
  IRumbleFeedback
> {
  constructor() {
    super('rumble_feedback');
  }
}

serviceCollection.addTransient(RumbleFeedbackModel);
