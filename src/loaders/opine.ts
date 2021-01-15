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
  log,
} from '../../deps.ts';
import routes from '../api/index.ts';

export default (app: Opine) => {
  const logger: log.Logger = serviceCollection.get('logger');
  // Test Endpoints
  app.get('/status', (req: Request, res: Response) => {
    logger.debug('GET 200 Test hit.');
    res.setStatus(200).end();
  });
  app.head('/status', (req: Request, res: Response) => {
    logger.debug('HEAD 200 Test hit.');
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
  // Parsing DB Errors/Catching Unhandled Errors
  app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
    logger.debug(`${err.status} ${err.message}`);
    if (err.message.includes('violates unique constraint')) {
      const dataName = err.message.match(/_([^_]+)/);
      return next(
        createError(
          409,
          dataName && dataName[1]
            ? '"' + dataName[1] + '" already in use'
            : 'Could not create duplicate'
        )
      );
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
