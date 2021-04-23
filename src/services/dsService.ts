import { Inject, log, PutObjectResponse, Service } from '../../deps.ts';
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

  //   try {
  //     const cmd = Deno.run({
  //       cmd: [
  //         'python',
  //         'scripts/process_submission/main.py',
  //         JSON.stringify(submission),
  //       ],
  //       stderr: 'piped',
  //       stdin: 'piped',
  //       stdout: 'piped',
  //     });
  //     const { err, output } = await this.processScriptResponse<IDSResponse>(
  //       cmd
  //     );
  //     cmd.close();
  //     if (err) throw new Error(err);
  //     return output;
  //   } catch (err) {
  //     console.log(err);
  //     throw err;
  //   }
  // }
}

serviceCollection.addTransient(DSService);
