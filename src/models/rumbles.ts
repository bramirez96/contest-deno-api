import { Service, serviceCollection } from '../../deps.ts';
import { IStudentWithSubmissions } from '../interfaces/cleverStudents.ts';
import { INewRumble, IRumble } from '../interfaces/rumbles.ts';
import BaseModel from './baseModel.ts';

@Service()
export default class RumbleModel extends BaseModel<INewRumble, IRumble> {
  constructor() {
    super('rumbles');
  }

  public async getActiveRumblesBySectionId(sectionId: number) {
    try {
      const rumbles = ((await this.db
        .table('rumbles')
        .innerJoin('rumble_sections', 'rumble_sections.rumbleId', 'rumbles.id')
        .innerJoin(
          'clever_sections',
          'clever_sections.id',
          'rumble_sections.sectionId'
        )
        .select('rumbles.*', 'rumble_sections.end_time')
        .where('clever_sections.id', sectionId)
        .execute()) as unknown[]) as IRumble[];

      return rumbles;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async getStudentsByRumbleId(rumbleId: number) {
    try {
      const students = ((await this.db
        .table('rumbles')
        .innerJoin('rumble_sections', 'rumble_sections.rumbleId', 'rumbles.id')
        .innerJoin(
          'clever_sections',
          'clever_sections.id',
          'rumble_sections.sectionId'
        )
        .innerJoin(
          'clever_students',
          'clever_students.sectionId',
          'clever_sections.id'
        )
        .innerJoin('users', 'users.id', 'clever_students.userId')
        .where('rumbles.id', rumbleId)
        .select('users.*')
        .execute()) as unknown[]) as IStudentWithSubmissions[];

      return students;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(RumbleModel);
