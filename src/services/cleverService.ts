import {
  Service,
  serviceCollection,
  Inject,
  CleverClient,
} from '../../deps.ts';
import { Roles } from '../interfaces/roles.ts';
import CleverSectionModel from '../models/cleverSections.ts';
import CleverStudentModel from '../models/cleverStudents.ts';
import CleverTeacherModel from '../models/cleverTeachers.ts';
import SSOLookupModel from '../models/ssoLookups.ts';
import UserModel from '../models/users.ts';
import BaseService from './baseService.ts';
import { SSOLookups } from '../interfaces/ssoLookups.ts';

@Service()
export default class CleverService extends BaseService {
  constructor(
    @Inject('clever') private clever: CleverClient,
    @Inject(UserModel) private userModel: UserModel,
    @Inject(SSOLookupModel) private ssoModel: SSOLookupModel,
    @Inject(CleverSectionModel) private sectionModel: CleverSectionModel,
    @Inject(CleverStudentModel) private studentModel: CleverStudentModel,
    @Inject(CleverTeacherModel) private teacherModel: CleverTeacherModel
  ) {
    super();
  }

  public async generateRoster(token: string, cleverTeacherId: string) {
    try {
      // Handle verything transactionally! If it fails, roll it ALL
      // back for data integrity. This is vital for scalability!
      await this.db.transaction(async () => {
        // Get the teacher's info from clever
        const { data: teacher } = await this.clever.getTeacher(
          cleverTeacherId,
          token
        );
        // Create a teacher user in our database
        const [{ id: teacherId }] = await this.userModel.add({
          email: teacher.email,
          firstname: teacher.name.first,
          lastname: teacher.name.last,
          isValidated: true,
          roleId: Roles.teacher,
        });
        // Add an SSO lookup row for the teacher
        await this.ssoModel.add({
          accessToken: teacher.id,
          providerId: SSOLookups.Clever,
          userId: teacherId,
        });
        // Loop over the teacher's section list
        for await (const cleverSectionId of teacher.sections) {
          // Get the info for each section
          const { data: section } = await this.clever.getSectionById(
            cleverSectionId,
            token
          );
          // Add each section to our database
          const [{ id: sectionId }] = await this.sectionModel.add({
            name: section.name,
            gradeId: parseInt(section.grade, 10),
            subjectId: parseInt(section.grade, 10),
          });
          // Connect that section to our existing teacher user
          await this.teacherModel.add({
            primary: true,
            sectionId,
            userId: teacherId,
          });
          // Query Clever for a list of all the students in the section
          const { data: students } = await this.clever.getStudentsBySection(
            cleverSectionId,
            token
          );
          // Create a student and user row for each student
          for await (const { data: student } of students) {
            // Add the new student user to the database
            const [{ id: studentId }] = await this.userModel.add({
              firstname: student.name.first,
              lastname: student.name.last,
              roleId: Roles.user,
              isValidated: true,
            });
            // Add a student row with the newly created id
            await this.studentModel.add({
              gradeId: parseInt(student.grade, 10),
              userId: studentId,
              sectionId,
            });
            // Add an SSO lookup row for the student
            await this.ssoModel.add({
              accessToken: student.id,
              providerId: SSOLookups.Clever,
              userId: studentId,
            });
          }
        }
      });
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(CleverService);
