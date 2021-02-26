import { Service, serviceCollection } from '../../deps.ts';
import { INewSSOLookup, ISSOLookup } from '../interfaces/ssoLookups.ts';
import BaseModel from './baseModel.ts';

@Service()
export default class SSOLookupModel extends BaseModel<
  INewSSOLookup,
  ISSOLookup
> {
  constructor() {
    super('sso_lookup');
  }
}

serviceCollection.addTransient(SSOLookupModel);
