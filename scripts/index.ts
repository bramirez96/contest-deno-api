const feedbackdata = [
  {
    submissionId: 1,
    voterId: 1,
  },
  {
    submissionId: 2,
    voterId: 2,
  },
  {
    submissionId: 3,
    voterId: 3,
  },
  {
    submissionId: 4,
    voterId: 4,
  },
  {
    submissionId: 5,
    voterId: 5,
  },
  {
    submissionId: 6,
    voterId: 6,
  },
];

interface IFeedbackItem {
  submissionId: number;
  voterId: number;
}

interface DSSubmissionItem {
  pages: Record<string | number, { filekey: string }>;
}
interface IDSResponse {
  transcription: string;
  confidence: number;
  score: number;
  rotation: number;
}

const dsItem: DSSubmissionItem = {
  pages: {
    1: { filekey: 'seedItem1.jpeg' },
    2: { filekey: 'seedItem2.jpeg' },
  },
};

class DSServiceTest {
  public async getFeedback(subs: IFeedbackItem[]): Promise<IFeedbackItem[]> {
    const cmd = Deno.run({
      cmd: ['python', 'scripts/feedback.py', JSON.stringify(subs)],
      stdin: 'piped',
      stdout: 'piped',
      stderr: 'piped',
    });
    const { err, output } = await this.processScriptResponse<IFeedbackItem[]>(
      cmd
    );
    cmd.close();
    if (err) throw new Error(err);
    return output;
  }

  public async processSubmission(
    submission: DSSubmissionItem
  ): Promise<IDSResponse> {
    try {
      const cmd = Deno.run({
        cmd: [
          'python',
          'scripts/process_submission/main.py',
          JSON.stringify(submission),
        ],
        stderr: 'piped',
        stdin: 'piped',
        stdout: 'piped',
      });
      const { err, output } = await this.processScriptResponse<IDSResponse>(
        cmd
      );
      cmd.close();
      if (err) throw new Error(err);
      return output;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  private async processScriptResponse<T = unknown>(
    res: Deno.Process
  ): Promise<{ output: T; err: string }> {
    const output = await res.output();
    const outStr = new TextDecoder().decode(output);
    let parsedOutput;

    const error = await res.stderrOutput();
    const errStr = new TextDecoder().decode(error);
    if (errStr.length > 0) console.log('err', errStr);

    try {
      parsedOutput = JSON.parse(outStr);
    } catch (err) {
      console.log(err);
    }

    return { output: parsedOutput, err: errStr };
  }
}

const Service = new DSServiceTest();

// const res = await Service.getFeedback(feedbackdata);
// console.log(res);

const res = await Service.processSubmission(dsItem);
console.log(res);
