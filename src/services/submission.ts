import { Inject, log, Service, serviceCollection } from '../../deps.ts';
import { INewSubmission, IUploadResponse } from '../interfaces/submissions.ts';
import SubmissionModel from '../models/submissions.ts';
import BucketService from './bucket.ts';

@Service()
export default class SubmissionService {
  constructor(
    @Inject(BucketService) protected bucketService: BucketService,
    @Inject(SubmissionModel) protected submissionModel: SubmissionModel,
    @Inject('logger') protected logger: log.Logger
  ) {}

  public async sendToDSAndStore(uploadResponse: IUploadResponse) {
    try {
      const newSub: INewSubmission = {
        ...uploadResponse,
        confidence: 20,
        dsScore: 20,
        promptId: 1,
        userId: 1,
        rotation: 0,
        transcription: 'HERES AN EXAMPLE OF THE THING LETS GO',
      };

      const submission = await this.submissionModel.add(newSub);
      return submission;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async retrieveImage(id: number) {
    try {
      const sub = await this.submissionModel.getOne(id);

      const fromS3 = await this.bucketService.get(sub.s3Label, sub.etag);

      return fromS3;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(SubmissionService);
