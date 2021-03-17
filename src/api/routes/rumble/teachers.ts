import {
  IRouter,
  isNumber,
  isString,
  log,
  minNumber,
  required,
  Router,
  serviceCollection,
  validateArray,
  validateObject,
} from '../../../../deps.ts';
import { INewSection } from '../../../interfaces/cleverSections.ts';
import { Roles } from '../../../interfaces/roles.ts';
import RumbleService from '../../../services/rumble.ts';
import authHandler from '../../middlewares/authHandler.ts';
import validate from '../../middlewares/validate.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  const rumbleServiceInstance = serviceCollection.get(RumbleService);
  app.use('/teachers', route);

  // GET /teachers/:teacherId/sections returns ISection[]
  route.get(
    '/:teacherId/sections',
    authHandler({ roles: [Roles.admin, Roles.teacher] }),
    async (req, res) => {
      try {
        const sections = await rumbleServiceInstance.getSections(req.body.user);
        res.setStatus(200).json(sections);
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );

  route.post(
    '/:teacherId/sections',
    authHandler({ roles: [Roles.admin, Roles.teacher] }),
    validate<INewSection>({
      name: [required, isString],
      gradeId: [required, isString],
      subjectId: [required, isString],
    }),
    async (req, res) => {
      try {
        const newSection = await rumbleServiceInstance.createSection(
          req.body,
          parseInt(req.params.teacherId, 10)
        );
        res.setStatus(201).json(newSection);
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );

  route.post(
    '/:teacherId/rumbles',
    authHandler({ roles: [Roles.teacher, Roles.admin] }),
    validate({
      rumble: validateObject(true, {
        numMinutes: [required, isNumber, minNumber(1)],
        promptId: [required, isNumber, minNumber(1)],
      }),
      sectionIds: validateArray(true, [isNumber, minNumber(1)], {
        minLength: 1,
      }),
    }),
    async (req, res) => {
      try {
        const rumble = await rumbleServiceInstance.createGameInstances(
          req.body.rumble,
          req.body.sectionIds
        );
        res.setStatus(201).json(rumble);
      } catch (err) {
        logger.error(err);
        throw err;
      }
    }
  );

  console.log('Rumble teacher route loaded.');
};
