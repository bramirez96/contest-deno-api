import {
  Request,
  Response,
  NextFunction,
  multiParser,
  serviceCollection,
  log,
  createError,
} from '../../../deps.ts';
import BucketService from '../../services/bucket.ts';

export default async (req: Request, res: Response, next: NextFunction) => {
  const logger: log.Logger = serviceCollection.get('logger');
  try {
    const form = await multiParser(req);
    if (!form) throw createError(400, 'No form data found');

    const bucketServiceInstance = serviceCollection.get(BucketService);
    const x = form.files.pages as { filename: string; content: Uint8Array };
    const uploadResponse = await bucketServiceInstance.upload(
      x.filename,
      x.content
    );
    console.log({ uploadResponse });

    next();
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
