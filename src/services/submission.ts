import { createError, Inject, Service, serviceCollection } from '../../deps.ts';
import {
  IDSResponse,
  INewSubmission,
  ISubItem,
  ISubmission,
  IUploadResponse,
} from '../interfaces/submissions.ts';
import { INewTop3 } from '../interfaces/top3.ts';
import PromptModel from '../models/prompts.ts';
import SubmissionModel from '../models/submissions.ts';
import Top3Model from '../models/top3.ts';
import UserModel from '../models/users.ts';
import BaseService from './baseService.ts';
import BucketService from './bucket.ts';
import DSService from './dsService.ts';
import { IGetQuery } from '../models/baseModel.ts';

@Service()
export default class SubmissionService extends BaseService {
  constructor(
    @Inject(BucketService) private bucketService: BucketService,
    @Inject(SubmissionModel) private submissionModel: SubmissionModel,
    @Inject(UserModel) private userModel: UserModel,
    @Inject(PromptModel) private promptModel: PromptModel,
    @Inject(Top3Model) private top3Model: Top3Model,
    @Inject(DSService) private dsService: DSService
  ) {
    super();
  }

  public async getUserSubs(
    userId: number,
    config: { limit: number; offset: number }
  ) {
    const subs = await this.submissionModel.get(
      { userId },
      {
        limit: config.limit,
        offset: config.offset,
        orderBy: 'created_at',
        order: 'DESC',
      }
    );

    // Pull codename for use in the retrieve subs, this reduces queries to db
    const { codename } = await this.userModel.get({ userId }, { first: true });
    // Query the S3 bucket/database for submission info
    const subItems = await Promise.all(
      subs.map((s) => this.retrieveSubItem(s, codename))
    );

    return subItems;
  }

  public async getSubs(
    config?: Omit<IGetQuery<false, keyof ISubmission>, 'first'>
  ) {
    const subs = await this.submissionModel.get(undefined, config);
    const subItems = await Promise.all(
      subs.map((s) => this.retrieveSubItem(s))
    );
    return subItems;
  }

  public async getTop3Subs() {
    // Pull top 3 subs from the table
    const top3 = ((await this.db
      .table('top3')
      .innerJoin('submissions', 'submissions.id', 'top3.submissionId')
      .order('top3.created_at', 'DESC')
      .select('submissions.*')
      .execute()) as unknown) as ISubmission[];

    // Process them and read in image data from S3 and return them
    const subs = await Promise.all(top3.map((t) => this.retrieveSubItem(t)));
    return subs;
  }

  public async setTop3(ids: number[]) {
    try {
      const formattedTop3: INewTop3[] = ids.map((id) => ({
        submissionId: id,
      }));
      const top3 = await this.top3Model.add(formattedTop3);
      return top3;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async getRecentWinner() {
    // Pull recent winner from the table
    const [winner] = ((await this.db
      .table('winners')
      .innerJoin('submissions', 'submissions.id', 'winners.submissionId')
      .order('winners.created_at', 'DESC')
      .select('submissions.*')
      .limit(1)
      .execute()) as unknown) as ISubmission[];

    // Process winner into a sub item and return it
    const sub = await this.retrieveSubItem(winner);
    return sub;
  }

  public async processSubmission(
    uploadResponse: IUploadResponse,
    promptId: number,
    userId: number
  ) {
    try {
      const dsReponse = await this.dsService.sendSubmissionToDS(uploadResponse);

      const newSub = this.formatNewSub(
        uploadResponse,
        dsReponse,
        promptId,
        userId
      );

      let submission: ISubmission | undefined;
      await this.db.transaction(async () => {
        submission = await this.submissionModel.add(newSub, true);
      });
      if (!submission) throw createError(409, 'File upload failed');

      return submission;
    } catch (err) {
      // If any part of upload fails, attempt to remove the item from the bucket for data integrity
      try {
        await this.bucketService.remove(uploadResponse.s3Label);
      } catch (err) {
        this.logger.critical(
          `S3 object ${uploadResponse.s3Label} is untracked!`
        );
      }
      this.logger.error(err);
      throw err;
    }
  }

  public async getFlagsBySubId(submissionId: number) {
    try {
      const flags = ((await this.db
        .table('submission_flags')
        .innerJoin('enum_flags', 'enum_flags.id', 'submission_flags.flagId')
        .select('enum_flags.flag')
        .where('submission_flags.submissionId', submissionId)
        .execute()) as unknown) as { flag: string }[];

      const parsedFlags = flags.map((flag) => flag.flag);
      return parsedFlags;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async flagSubmission(submissionId: number, flagIds: number[]) {
    try {
      const flagItems = flagIds.map((flagId) => ({
        flagId,
        submissionId: submissionId,
      }));
      const flags = await this.db
        .table('submission_flags')
        .insert(flagItems)
        .returning('*')
        .execute();
      return flags;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  private async retrieveSubItem(
    sub: ISubmission,
    codename?: string
  ): Promise<ISubItem> {
    try {
      const fromS3 = await this.bucketService.get(sub.s3Label, sub.etag);

      // Generate img src tag
      const src = this.generateImgSrc(fromS3.body);

      // Get prompt
      const { prompt } = await this.promptModel.get(
        { id: sub.promptId },
        { first: true }
      );

      // Get Codename
      if (!codename) {
        const user = await this.userModel.get(
          { id: sub.userId },
          { first: true }
        );
        codename = user.codename;
      }

      // Remove s3 info from the response and add the image data
      return {
        id: sub.id,
        src,
        score: sub.score,
        prompt,
        rotation: sub.rotation,
        codename,
        userId: sub.userId,
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  private formatNewSub(
    u: IUploadResponse,
    d: IDSResponse,
    promptId: number,
    userId: number
  ): INewSubmission {
    return {
      confidence: d.confidence,
      score: d.score,
      transcription: d.transcription,
      rotation: d.rotation,
      etag: u.etag,
      s3Label: u.s3Label,
      userId: userId,
      promptId: promptId,
    };
  }

  private generateImgSrc(body: Uint8Array) {
    const buff = btoa(
      body.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    return `data:application/octet-stream;base64,${buff}`;
  }
}

serviceCollection.addTransient(SubmissionService);
