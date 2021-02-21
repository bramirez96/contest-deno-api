import { Service, serviceCollection } from '../../deps.ts';
import { INewTeacher, ITeacher } from '../interfaces/cleverTeachers.ts';
import BaseModel from './baseModel.ts';

@Service()
export default class CleverTeacherModel extends BaseModel<
  INewTeacher,
  ITeacher
> {
  constructor() {
    super('clever_teachers');
  }
}

serviceCollection.addTransient(CleverTeacherModel);
