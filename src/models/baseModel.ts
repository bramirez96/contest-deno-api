import {
  log,
  QueryValues,
  serviceCollection,
  PostgresAdapter,
  DatabaseResult,
  OrderDirection,
} from '../../deps.ts';

/**
 * Type T: new item interface, should be the fields required to
 * create a new item\
 * Type U: complete item interface, all fields from the table
 *
 * This is important if you want good linting from member functions!
 */
export default class BaseModel<T, U> {
  constructor(tableName: string) {
    this.tableName = tableName;
    this.db = serviceCollection.get('pg');
    this.logger = serviceCollection.get('logger');
  }
  private tableName: string;
  private db: PostgresAdapter;
  private logger: log.Logger;

  // Putting basic CRUD operations on all Models

  // Overloading function call for better linting and usability :)
  public async add<B extends boolean>(body: T & QueryValues): Promise<U[]>;
  public async add<B extends boolean>(
    body: T & QueryValues,
    first?: B
  ): Promise<B extends true ? U : U[]>;
  public async add(body: T & QueryValues, first?: boolean): Promise<U | U[]> {
    this.logger.debug(`Attempting to add field to table ${this.tableName}`);

    const response = ((await this.db
      .table(this.tableName)
      .insert(body)
      .returning('*')
      .execute()) as unknown[]) as U[];

    this.logger.debug(`Successfully added row to table ${this.tableName}`);
    return first ? response[0] : response;
  }

  public async get(): Promise<U[]>;
  public async get(filter?: Partial<U> & DatabaseResult): Promise<U[]>;
  public async get<B extends false, K extends keyof U>(
    filter?: undefined,
    config?: IGetResponse<B | undefined, K>
  ): Promise<U[]>;
  public async get<B extends boolean, K extends keyof U>(
    filter?: undefined,
    config?: IGetResponse<B, K>
  ): Promise<B extends true ? U : U[]>;
  public async get<B extends false, K extends keyof U>(
    filter?: Partial<U> & DatabaseResult,
    config?: IGetResponse<B, K>
  ): Promise<U[]>;
  public async get<B extends boolean, K extends keyof U>(
    filter?: Partial<U> & DatabaseResult,
    config?: IGetResponse<B, K>
  ): Promise<B extends true ? U : U[]>;
  public async get(
    filter?: (Partial<U> & DatabaseResult) | undefined,
    config?: IGetResponse<boolean, string>
  ): Promise<U | U[]> {
    this.logger.debug(`Attempting to retrieve all rows from ${this.tableName}`);

    const sql = this.db.table(this.tableName).select('*');
    if (filter) {
      sql.where(...Object.entries(filter)[0]);
    }
    if (config?.limit) {
      sql.limit(config.limit);
    }
    if (config?.orderBy) {
      sql.order(config.orderBy as string, config?.order || 'ASC');
    }
    const response = (await (sql.execute() as unknown)) as U[];

    return config?.first ? response[0] : response;
  }

  public async update(
    id: number,
    changes: Partial<U> & DatabaseResult
  ): Promise<U> {
    this.logger.debug(`Attempting to retrieve one row from ${this.tableName}`);

    const [response] = ((await this.db
      .table(this.tableName)
      .where('id', id)
      .update(changes)
      .returning('*')
      .execute()) as unknown) as U[];

    this.logger.debug(`Successfully updated row from ${this.tableName}`);
    return response;
  }

  public async delete(id: number): Promise<void> {
    this.logger.debug(`Attempting to delete row ${id} from ${this.tableName}`);

    await this.db.table(this.tableName).where('id', id).delete().execute();

    this.logger.debug(`Successfully deleted row ${id} from ${this.tableName}`);
  }
}

interface IGetResponse<B, K> {
  first?: B;
  limit?: number;
  orderBy?: K;
  order?: OrderDirection;
}
