import {
  Opine,
  Request,
  Response,
  json,
  opineCors,
  urlencoded,
  createError,
  NextFunction,
  IError,
  serviceCollection,
  Logger,
} from '../../deps.ts';
import routes from '../api/index.ts';

export default (app: Opine) => {
  const logger: Logger = serviceCollection.get('logger');
  // Test Endpoints
  app.get('/status', (req: Request, res: Response) => {
    logger.debug('200 Test hit.');
    res.setStatus(200).end();
  });
  app.head('/status', (req: Request, res: Response) => {
    logger.debug('200 Test hit.');
    res.setStatus(200).end();
  });

  // Middleware
  app.use(json());
  app.use(
    opineCors({
      origin: true,
    })
  );
  app.use(urlencoded({ extended: false }));

  // App Routes
  app.use('/api', routes());

  // Error Handlers
  // Invalid Route
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404, 'Route Not Found'));
  });
  // Parsing DB Errors
  app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
    if (err.message.includes('violates unique constraint')) {
      return next(createError(403, 'Could not create duplicate'));
    } else if (err.status === 500) {
      logger.warning(
        `${err.status || 500} ${err.message} - NEEDS CUSTOM ERROR HANDLING`
      );
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
