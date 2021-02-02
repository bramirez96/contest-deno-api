import {
  Opine,
  Request,
  Response,
  NextFunction,
  createError,
  IError,
  log,
  serviceCollection,
} from '../../deps.ts';

export default (app: Opine) => {
  const logger: log.Logger = serviceCollection.get('logger');

  // Invalid Route
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404, 'Route not found'));
  });

  // Parsing DB Errors/Catching Unhandled Errors
  app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
    logger.debug(`${err.status} ${err.message}`);
    if (err.message.includes('violates unique constraint')) {
      return next(createError(409, 'Could not create duplicate'));
    } else if (err.message.includes('violates foreign key constraint')) {
      return next(createError(409, 'Invalid foreign key'));
    } else if (!err.status || err.status === 500) {
      logger.warning(`${err.message} - NEEDS CUSTOM ERROR HANDLING`);
    }
    next(err);
  });

  // Fallback Error
  app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
    logger.debug(`${err.status} - { error: '${err.message}' }`);
    res
      .setStatus(err.status || 500)
      .json({ message: err.message || 'Something went wrong.' });
  });
};
