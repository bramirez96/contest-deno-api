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
import env from '../config/env.ts';
import formParser from './formParser.ts';

export default (app: Opine) => {
  const logger: log.Logger = serviceCollection.get('logger');
  // Log all API calls to the server
  app.use((req: Request, res: Response, next: NextFunction) => {
    const now = new Date();
    const query = new URLSearchParams(req.query).toString();
    logger.debug(
      `[${req.method}] ${req.path}${query.length > 0 ? '?' + query : ''} \
      (${req.ip})[${now.toISOString()}]`
    );
    next();
  });

  // Test Endpoints
  app.get('/status', (req: Request, res: Response) => {
    logger.debug('GET 200 Test hit.');
    res.setStatus(200).json({ message: 'API up!' });
  });
  app.head('/status', (req: Request, res: Response) => {
    logger.debug('HEAD 200 Test hit.');
    res.setStatus(200).json({ message: 'API up!' });
  });

  // Middleware
  app.use(json());
  app.use(
    opineCors({
      origin: true,
    })
  );
  app.use(urlencoded({ extended: false }));

  if (env.DENO_ENV !== 'testing') {
    app.use(formParser());
    console.log('Form parser loaded.');
  }

  // App Routes
  app.use(routes());

  // Error Handlers
  // Invalid Route
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404, 'Route Not Found'));
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
