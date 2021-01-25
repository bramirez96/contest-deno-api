import { Service, serviceCollection } from '../../deps.ts';
import { INewValidation, IValidation } from '../interfaces/validations.ts';
import BaseModel from './baseModel.ts';

@Service()
export default class ValidationModel extends BaseModel<
  INewValidation,
  IValidation
> {
  constructor() {
    super('validations');
  }
}

serviceCollection.addTransient(ValidationModel);
