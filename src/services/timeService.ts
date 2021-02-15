import { moment, Service, serviceCollection } from '../../deps.ts';
import BaseService from './baseService.ts';

Service();
export default class TimeService extends BaseService {
  constructor() {
    super();
  }
}

serviceCollection.addTransient(TimeService);
