import {
  Request,
  Response,
  NextFunction,
  multiParser,
  serviceCollection,
  log,
  createError,
  FormFile,
  extension,
} from '../../../deps.ts';
import BucketService from '../../services/bucket.ts';

export default async (req: Request, res: Response, next: NextFunction) => {
  const logger: log.Logger = serviceCollection.get('logger');
  try {
    // Parse the form data, and throw if none found
    const form = await multiParser(req);
    if (!form) throw createError(400, 'No form data found');

    const bucketServiceInstance = serviceCollection.get(BucketService);

    // This will store our uploaded files as we iterate over each field
    const resolvedFiles: {
      [key: string]: { etag: string; bucketStorageTag: string }[];
    } = {};
    // Generate checksums later!

    // Loop over each FormData field with file data
    const fileFieldNames = Object.keys(form.files);
    for await (const f of fileFieldNames) {
      // Check if it's an array, if so, we're uploading multiple files
      if (Array.isArray(form.files[f])) {
        // Multiple file upload
        const files = form.files[f] as FormFile[];
        logger.debug(
          `Attempting to upload ${files.length} files for field: ${f}`
        );

        // Generate a list of fileUpload promises
        const promiseList = files.map((fileData) =>
          bucketServiceInstance.upload(
            fileData.content,
            extension(fileData.contentType)
          )
        );

        // Resolve those promises together and add them to the resolvedFiles object
        const resolved = await Promise.all(promiseList);
        resolvedFiles[f] = resolved;
        logger.debug(
          `Successfully uploaded ${files.length} files for field: ${f}`
        );
      } else {
        // Single file upload
        logger.debug(`Attempting to upload one file for field: ${f}`);
        const fileData = form.files[f] as FormFile;

        // Upload the single file and append it to the reolvedFiles object as an array
        const resolved = await bucketServiceInstance.upload(
          fileData.content,
          extension(fileData.contentType)
        );
        resolvedFiles[f] = [resolved];
        logger.debug(`Successfully uploaded file for field: ${f}`);
      }
    }

    // Add the resolved file data as well as the form field data to the original req.body
    req.body = {
      ...req.body,
      ...resolvedFiles,
      ...form.fields,
    };

    next();
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
