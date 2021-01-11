import {
  Schema,
  Request,
  Response,
  NextFunction,
  createError,
} from '../../../deps.ts';

export default (schema: Schema) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vRes = schema.validate(req.body) as IValidationResponse;
  if (vRes.errors && Object.keys(vRes.errors).length !== 0) {
    next(createError(400, 'Invalid request data'));
  } else {
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
