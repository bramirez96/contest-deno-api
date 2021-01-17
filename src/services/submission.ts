import {
  Inject,
  log,
  Service,
  serviceCollection,
  Form,
  multiParser,
  createError,
  FormFile,
  extension,
} from '../../deps.ts';
import BucketService from './bucket.ts';

@Service()
export default class SubmissionService {
  constructor(
    @Inject(BucketService) protected bucketService: BucketService,
    @Inject('logger') protected logger: log.Logger
  ) {}

  public async upload(form: Form) {
    try {
      const response = await form;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
