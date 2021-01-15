import {
  Schema,
  Request,
  Response,
  NextFunction,
  createError,
  log,
  serviceCollection,
} from '../../../deps.ts';

export default (schema: Schema, toValidate: 'query' | 'body' = 'body') => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const logger: log.Logger = serviceCollection.get('logger');
  logger.debug(`Validating ${toValidate} for endpoint: ${req.path}`);

  // Validate and pull errors
  const vRes = schema.validate(req[toValidate]) as IValidationResponse;
  const errorFields = Object.keys(vRes.errors || {}); // handle library bug edge cases

  // Check if there were any validation errors
  if (errorFields.length !== 0) {
    // Create an error and let the client know which fields are erroneous
    next(
      createError(
        400,
        `Invalid or missing data for ${toValidate}: ${errorFields.join(', ')}`
      )
    );
    req.path;
  } else {
    logger.debug(`Validated ${toValidate} for endpoint: ${req.path}`);
    next();
  }
};

/**
 * The validation library is declaring incorrect interfaces. Coercing the
 * type of the validation response allows us to pass Typescript linting
 * while receiving proper responses from the library.
 */
interface IValidationResponse {
  value: { [key: string]: string };
  errors: { [key: string]: string };
}
