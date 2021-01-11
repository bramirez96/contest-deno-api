import {
  S3Bucket,
  Request,
  Response,
  NextFunction,
  multiParser,
} from '../../../deps.ts';
import env from '../../config/env.ts';

const s3 = new S3Bucket(env.S3_CONFIG);

const uploadFile = (name: string, buffer: Uint8Array) => {
  return s3.putObject(name, buffer);
};

export default async (req: Request, res: Response, next: NextFunction) => {
  const form = await multiParser(req);

  if (!form) {
    return res.setStatus(403).json({ message: 'No form data detected.' });
  }
  try {
    const x = form.files.pages as { filename: string; content: Uint8Array };
    const uploadResponse = await uploadFile(x.filename, x.content);
    console.log(uploadResponse);

    next();
  } catch (err) {
    res.setStatus(409).json({ error: 'Could not upload to S3.' });
  }
};
