import { serviceCollection, PostgresAdapter } from '../../deps.ts';

export default class BaseService {
  constructor() {
    this.transaction = (serviceCollection.get(
      'db'
    ) as PostgresAdapter).transaction;
  }
  public transaction: PostgresAdapter['transaction'];
}
