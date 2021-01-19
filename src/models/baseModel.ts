import { DatabaseValues } from 'https://deno.land/x/cotton@v0.7.5/src/adapters/adapter.ts';
import {
  log,
  QueryValues,
  serviceCollection,
  PostgresAdapter,
  DatabaseResult,
} from '../../deps.ts';

/**
 * When extending this class, T is the 'INewItem' interface,
 * and U is the 'IItem' interface, meaning that the interface
 * for T should include all the fields needed to create a new
 * row, while U should contain all columns on the table.
 *
 * This is important if you want good linting!
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

  public async getOne(filter: Partial<U> & DatabaseResult): Promise<U> {
    this.logger.debug(`Attempting to retrieve one row from ${this.tableName}`);

    const [response] = ((await this.db
      .table(this.tableName)
      .where(...Object.entries(filter)[0])
      .select('*')
      .execute()) as unknown) as U[];

    this.logger.debug(`Successfully retrieved row from ${this.tableName}`);
    return response;
  }

  public async getAll(): Promise<U[]> {
    this.logger.debug(`Attempting to retrieve all rows from ${this.tableName}`);

    const response = ((await this.db
      .table(this.tableName)
      .select('*')
      .execute()) as unknown) as U[];

    this.logger.debug(`Successfully retrieved rows from ${this.tableName}`);
    return response;
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

    const res = await this.db
      .table(this.tableName)
      .where('id', id)
      .delete()
      .execute();

    this.logger.debug(`Successfully deleted row ${id} from ${this.tableName}`);
  }
}
