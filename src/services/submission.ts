import { createError, Inject, Service, serviceCollection } from '../../deps.ts';
import {
  IDSResponse,
  INewSubmission,
  ISubItem,
  ISubmission,
  IUploadResponse,
} from '../interfaces/submissions.ts';
import PromptModel from '../models/prompts.ts';
import SubmissionModel from '../models/submissions.ts';
import UserModel from '../models/users.ts';
import BaseService from './baseService.ts';
import BucketService from './bucket.ts';
import DSService from './dsService.ts';

@Service()
export default class SubmissionService extends BaseService {
  constructor(
    @Inject(BucketService) private bucketService: BucketService,
    @Inject(SubmissionModel) private submissionModel: SubmissionModel,
    @Inject(UserModel) private userModel: UserModel,
    @Inject(PromptModel) private promptModel: PromptModel,
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

  public async retrieveSubItem(
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
        score: sub.dsScore,
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
      dsScore: d.dsScore,
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
