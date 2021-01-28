import { createError, Inject, Service, serviceCollection } from '../../deps.ts';
import {
  IDSResponse,
  INewSubmission,
  ISubmission,
  IUploadResponse,
} from '../interfaces/submissions.ts';
import SubmissionModel from '../models/submissions.ts';
import BaseService from './baseService.ts';
import BucketService from './bucket.ts';
import DSService from './dsService.ts';

@Service()
export default class SubmissionService extends BaseService {
  constructor(
    @Inject(BucketService) private bucketService: BucketService,
    @Inject(SubmissionModel) private submissionModel: SubmissionModel,
    @Inject(DSService) private dsService: DSService
  ) {
    super();
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

  public async retrieveImage(s3Label: string, etag: string) {
    try {
      const fromS3 = await this.bucketService.get(s3Label, etag);
      return fromS3;
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
      dsScore: d.dsScore,
      transcription: d.transcription,
      rotation: d.rotation,
      etag: u.etag,
      s3Label: u.s3Label,
      userId,
      promptId,
    };
  }
}

serviceCollection.addTransient(SubmissionService);
