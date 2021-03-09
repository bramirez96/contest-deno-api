import { Service, serviceCollection } from '../../deps.ts';
import { INewSection, ISection } from '../interfaces/cleverSections.ts';
import { IStudentWithSubmissions } from '../interfaces/cleverStudents.ts';
import BaseModel from './baseModel.ts';

@Service()
export default class CleverSectionModel extends BaseModel<
  INewSection,
  ISection
> {
  constructor() {
    super('clever_sections');
  }

  public async getStudentsBySectionId(sectionId: number) {
    try {
      const students = ((await this.db
        .table('clever_sections')
        .innerJoin(
          'clever_students',
          'clever_students.sectionId',
          'clever_sections.id'
        )
        .innerJoin('users', 'users.id', 'clever_students.userId')
        .where('clever_sections.id', sectionId)
        .select('users.*')
        .execute()) as unknown[]) as IStudentWithSubmissions[];

      return students;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(CleverSectionModel);
