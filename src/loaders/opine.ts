import {
  Opine,
  Request,
  Response,
  json,
  opineCors,
  urlencoded,
  NextFunction,
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
    logger.debug(
      `[${req.method}] ${req.path} (${req.ip})[${now.toISOString()}]`
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
  app.use('/api', routes());
};
