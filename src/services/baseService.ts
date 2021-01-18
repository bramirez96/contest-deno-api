import { serviceCollection, Adapter } from '../../deps.ts';

export default class BaseService {
  constructor() {
    this.db = serviceCollection.get('pg');
  }
  protected db: Adapter;
}
