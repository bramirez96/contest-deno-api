import { S3Bucket, Service, Inject, log } from '../../deps.ts';

@Service()
export default class BucketService {
  constructor(
    @Inject('s3') private s3: S3Bucket,
    @Inject('logger') private logger: log.Logger
  ) {}

  public async upload(name: string, buffer: Uint8Array) {
    try {
      this.logger.debug(`Beginning upload of ${name}`);
      const response = await this.s3.putObject(name, buffer);
      this.logger.debug(`Upload file (${name}) successful`);
      return response;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
