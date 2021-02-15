import {
  Service,
  Inject,
  serviceCollection,
  log,
  PutObjectResponse,
} from '../../deps.ts';
import { IDSResponse } from '../interfaces/submissions.ts';

@Service()
export default class DSService {
  constructor(@Inject('logger') private logger: log.Logger) {}

  public async sendSubmissionToDS(
    s3Object: PutObjectResponse
  ): Promise<IDSResponse> {
    const res = await Promise.resolve<IDSResponse>({
      transcription: 'asdaksfmnasdlkcfmnasdlfkasmfdlkasdf',
      confidence: 50,
      score: Math.floor(Math.random() * 40 + 10), // Rand 10-50
      rotation: 0,
    });

    return res;
  }
}

serviceCollection.addTransient(DSService);
