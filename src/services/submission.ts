import { Inject, log, Service, serviceCollection } from '../../deps.ts';
import {
  IDSResponse,
  INewSubmission,
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
    @Inject(DSService) private dsService: DSService,
    @Inject('logger') private logger: log.Logger
  ) {
    super();
  }

  public async sendToDSAndStore(
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

      const submission = await this.submissionModel.add(newSub, true);
      return submission;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public retrieveImage(id: number) {
    try {
      // const sub = await this.submissionModel.getOne(id);
      // const fromS3 = await this.bucketService.get(sub.s3Label, sub.etag);
      // return fromS3;
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
