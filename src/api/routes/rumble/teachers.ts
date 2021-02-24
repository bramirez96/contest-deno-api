import {
  Router,
  IRouter,
  log,
  serviceCollection,
  required,
  isString,
} from '../../../../deps.ts';
import { INewSection } from '../../../interfaces/cleverSections.ts';
import { Roles } from '../../../interfaces/roles.ts';
import CleverTeacherModel from '../../../models/cleverTeachers.ts';
import CleverService from '../../../services/cleverService.ts';
import authHandler from '../../middlewares/authHandler.ts';
import validate from '../../middlewares/validate.ts';

const route = Router();

export default (app: IRouter) => {
  const logger: log.Logger = serviceCollection.get('logger');
  app.use('/teachers', route);

  // GET /teachers/:teacherId/sections returns ISection[]
  route.get(
    '/:teacherId/sections',
    authHandler({ roles: [Roles.admin, Roles.teacher] }),
    async (req, res) => {
      try {
        const teacherModelInstance = serviceCollection.get(CleverTeacherModel);
        const sections = await teacherModelInstance.getSectionsById(
          parseInt(req.params.teacherId, 10)
        );
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
        const cleverServiceInstance = serviceCollection.get(CleverService);
        const newSection = await cleverServiceInstance.createSection(
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

  console.log('Rumble teacher route loaded.');
};
