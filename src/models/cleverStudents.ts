import { Service, serviceCollection } from '../../deps.ts';
import { INewStudent, IStudent } from '../interfaces/cleverStudents.ts';
import BaseModel from './baseModel.ts';

Service();
export default class CleverStudentModel extends BaseModel<
  INewStudent,
  IStudent
> {
  constructor() {
    super('clever_students');
  }
}

serviceCollection.addTransient(CleverStudentModel);
