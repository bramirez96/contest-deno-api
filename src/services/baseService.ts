import { serviceCollection, PostgresAdapter, log } from '../../deps.ts';

export default class BaseService {
  constructor() {
    this.db = serviceCollection.get('pg');
    this.logger = serviceCollection.get('logger');
  }
  public db: PostgresAdapter;
  protected logger: log.Logger;
}
