import { serviceCollection, PostgresAdapter } from '../../deps.ts';

export default class BaseService {
  constructor() {
    this.db = serviceCollection.get('pg');
  }
  public db: PostgresAdapter;
}
