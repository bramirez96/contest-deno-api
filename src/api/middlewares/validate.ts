import {
  ValidationRules,
  validate,
  Request,
  Response,
  NextFunction,
  createError,
  log,
  serviceCollection,
} from '../../../deps.ts';

export default (
  schema: ValidationRules,
  toValidate: 'query' | 'body' = 'body'
) => async (req: Request, res: Response, next: NextFunction) => {
  const logger: log.Logger = serviceCollection.get('logger');
  try {
    logger.debug(`Validating ${toValidate} for endpoint: ${req.path}`);

    // Validate and pull errors
    const [passes, errors] = await validate(req[toValidate], schema);
    const errorFields = Object.keys(errors); // handle library bug edge cases

    if (passes) {
      logger.debug(`Validated ${toValidate} for endpoint: ${req.path}`);
      return next();
    } else {
      throw createError(
        400,
        `Invalid or missing fields: ${errorFields.join(', ')}`
      );
    }
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};
