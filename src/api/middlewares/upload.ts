import {
  Request,
  Response,
  NextFunction,
  serviceCollection,
  log,
  createError,
  FormFile,
  extension,
} from '../../../deps.ts';
import BucketService from '../../services/bucket.ts';

export default (...fileNames: string[]) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const logger: log.Logger = serviceCollection.get('logger');
  try {
    const bucketServiceInstance = serviceCollection.get(BucketService);

    // Loop over each FormData field with file data
    for await (const f of fileNames) {
      if (!req.body[f] || !Array.isArray(req.body[f]))
        throw createError(400, `Could not find files in field ${f}`);

      // Multiple file upload
      const fileArray = req.body[f] as FormFile[];
      logger.debug(
        `Attempting to upload ${fileArray.length} files for field: ${f}`
      );

      // Generate a list of fileUpload promises
      const promiseList = fileArray.map((fileData) =>
        bucketServiceInstance.upload(
          fileData.content,
          extension(fileData.contentType)
        )
      );

      // Resolve those promises together and replace the form data in the body with the file names
      const resolved = await Promise.all(promiseList);
      req.body[f] = resolved;
      logger.debug(
        `Successfully uploaded ${fileArray.length} files for field: ${f}`
      );
    }

    next();
  } catch (err) {
    console.log(err);
    logger.error(err);
    throw err;
  }
};
