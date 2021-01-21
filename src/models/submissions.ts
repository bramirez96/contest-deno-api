import { Service, serviceCollection } from '../../deps.ts';
import { INewSubmission, ISubmission } from '../interfaces/submissions.ts';
import BaseModel from './baseModel.ts';

@Service()
export default class SubmissionModel extends BaseModel<
  INewSubmission,
  ISubmission
> {
  constructor() {
    super('submissions');
  }
}

serviceCollection.addTransient(SubmissionModel);
