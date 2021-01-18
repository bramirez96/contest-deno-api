import {
  Service,
  Inject,
  Client,
  log,
  Where,
  createError,
  serviceCollection,
  Query,
} from '../../deps.ts';
import {
  INewPrompt,
  IPrompt,
  IPromptQueueItem,
} from '../interfaces/prompts.ts';
import PGModel from './pgModel.ts';

@Service()
export default class PromptModel extends PGModel {
  constructor(
    @Inject('pg') private dbConnect: Client,
    @Inject('logger') private logger: log.Logger
  ) {
    super();
  }

  public async getCurrent() {
    try {
      this.logger.debug(`Retrieving current active prompt`);

      const builder = new Query();
      const sql = builder
        .table('prompts')
        .select('*')
        .where(Where.field('active').eq(true))
        .build();

      // Parse and run query
      const response = await this.dbConnect.query(this.parseSql(sql));
      if (response.rowCount === 0) {
        throw createError(500, 'UH OH! No active prompts!!!');
      }

      const prompt = (this.parseResponse(response, {
        first: true,
      }) as unknown) as IPrompt;
      this.logger.debug(`Prompt (ID: ${prompt.id}) retrieved`);

      return prompt;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async getQueuedPrompt() {
    try {
      this.logger.debug(`Retriving prompt id from queue`);

      const builder = new Query();
      const sql = builder
        .table('prompt_queue')
        .select('*')
        .where(
          Where.field('startDate').eq(new Date().toISOString().split('T')[0])
        )
        .build();

      const response = await this.dbConnect.query(this.parseSql(sql));
      if (response.rowCount === 0) {
        throw createError(500, 'No new prompt in queue!');
      }

      const { promptId } = (this.parseResponse(response, {
        first: true,
      }) as unknown) as IPromptQueueItem;
      this.logger.debug(`Retrieved prompt (ID: ${promptId}) from queue`);

      return promptId;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async update(id: number, changes: Partial<IPrompt>) {
    try {
      this.logger.debug(
        `Updating prompt (ID: ${id}) fields: ${Object.keys(changes).join(', ')}`
      );

      const builder = new Query();
      const sql = builder
        .table('prompts')
        .where(Where.field('id').eq(id))
        .update(changes)
        .build();
      const sqlWithReturn = sql + 'RETURNING *';

      // Parse and run query
      const response = await this.dbConnect.query(this.parseSql(sqlWithReturn));
      if (response.rowCount === 0) {
        throw createError(409, `Unable to update prompt of ID ${id}`);
      }

      const prompt = (this.parseResponse(response, {
        first: true,
      }) as unknown) as IPrompt;
      this.logger.debug(`Prompt (ID: ${id}) successfully updated`);

      return prompt;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async getAllPrompts() {
    try {
      this.logger.debug('Attempting to retrieve all prompts from database');

      const builder = new Query();
      const sql = builder.table('prompts').select('*').build();

      const response = await this.dbConnect.query(this.parseSql(sql));

      const prompts = (this.parseResponse(response) as unknown) as IPrompt[];
      this.logger.debug(
        `${prompts.length} prompt${prompts.length === 1 ? '' : 's'} retrieved`
      );

      return prompts;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async add(prompt: INewPrompt) {
    this.logger.debug(`Attempting to add new prompt`);

    const builder = new Query();
    const sql = builder.table('prompts').insert(prompt).build();
    const sqlWithReturn = sql + ' RETURNING *';

    const response = await this.dbConnect.query(this.parseSql(sql));

    const newPrompt = ((await this.parseResponse(response, {
      first: true,
    })) as unknown) as IPrompt;
    this.logger.debug(`New prompt added with id ${newPrompt.id}`);

    return newPrompt;
  }
}

serviceCollection.addTransient(PromptModel);
