import {
  Request,
  Response,
  NextFunction,
  log,
  serviceCollection,
  multiParser,
  createError,
  FormFile,
} from '../../deps.ts';

export default () => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const logger: log.Logger = serviceCollection.get('logger');
  try {
    const form = await multiParser(req);
    if (!form) throw createError(400, 'No form data found in request');

    if (form.files) {
      const files: { [key: string]: FormFile[] } = {};
      const fileFieldNames = Object.keys(form.files);
      for (const f of fileFieldNames) {
        if (Array.isArray(form.files[f])) {
          files[f] = form.files[f] as FormFile[];
        } else {
          files[f] = [form.files[f] as FormFile];
        }
      }
      req.body = { ...req.body, ...files };
    }
    if (form.fields) {
      req.body = { ...req.body, ...form.fields };
    }
    next();
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};
