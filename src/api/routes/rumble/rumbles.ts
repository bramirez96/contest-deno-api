import {
  IRouter,
  isNumber,
  log,
  required,
  Router,
  serviceCollection,
} from '../../../../deps.ts';
import { Roles } from '../../../interfaces/roles.ts';
import RumbleModel from '../../../models/rumbles.ts';
import RumbleService from '../../../services/rumble.ts';
import authHandler from '../../middlewares/authHandler.ts';
import validate from '../../middlewares/validate.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const rumbleServiceInstance = serviceCollection.get(RumbleService);
  const rumbleModelInstance = serviceCollection.get(RumbleModel);

  app.use('/rumbles', route);

  route.get(
    '/:rumbleId',
    authHandler(),
    validate({ id: [required, isNumber] }, 'params'),
    async (req, res) => {
      try {
        const [rumble] = await rumbleModelInstance.get({
          id: parseInt(req.params.id),
        });
        res.setStatus(200).json(rumble);
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );

  // GET /rumbles/:rumbleId/students - returns a list of students with subs
  route.get(
    '/:rumbleId/students',
    authHandler({ roles: [Roles.admin, Roles.teacher] }),
    async (req, res) => {
      try {
        const students = await rumbleServiceInstance.getStudentsWithSubForRumble(
          parseInt(req.params.rumbleId, 10)
        );
        console.log(
          'students',
          students.map((s) => s.submissions)
        );
        res.setStatus(200).json(students);
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );
};
