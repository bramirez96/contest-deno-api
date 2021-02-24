import {
  Router,
  IRouter,
  log,
  serviceCollection,
  required,
  isString,
  match,
} from '../../../../deps.ts';
import { uuidV5Regex } from '../../../config/dataConstraints.ts';
import validate from '../../middlewares/validate.ts';
import RumbleService from '../../../services/rumble.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const rumbleServiceInstance = serviceCollection.get(RumbleService);
  app.use('/sections', route);

  // POST /:sectionId/students/:studentId - adds a student to a section
  route.post(
    '/:sectionId/students/:studentId',
    validate({
      joinCode: [required, isString, match(uuidV5Regex)],
    }),
    async (req, res) => {
      try {
        const section = await rumbleServiceInstance.addChildToSection(
          req.body.joinCode,
          parseInt(req.params.sectionId, 10),
          parseInt(req.params.studentId, 10)
        );

        res.setStatus(201).json(section);
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );

  console.log('Rumble sections route loaded successfully.');
};
