import {
  Service,
  Inject,
  serviceCollection,
  createError,
  v5,
  moment,
} from '../../deps.ts';
import env from '../config/env.ts';
import { ISection, ISectionPostBody } from '../interfaces/cleverSections.ts';
import { IRumble, IRumblePostBody } from '../interfaces/rumbles.ts';
import CleverSectionModel from '../models/cleverSections.ts';
import CleverStudentModel from '../models/cleverStudents.ts';
import CleverTeacherModel from '../models/cleverTeachers.ts';
import RumbleModel from '../models/rumbles.ts';
import RumbleSectionsModel from '../models/rumbleSections.ts';
import UserModel from '../models/users.ts';
import BaseService from './baseService.ts';

@Service()
export default class RumbleService extends BaseService {
  constructor(
    @Inject(UserModel) private userModel: UserModel,
    @Inject(RumbleModel) private rumbleModel: RumbleModel,
    @Inject(CleverTeacherModel) private teacherModel: CleverTeacherModel,
    @Inject(RumbleSectionsModel) private rumbleSections: RumbleSectionsModel,
    @Inject(CleverStudentModel) private studentModel: CleverStudentModel,
    @Inject(CleverSectionModel) private sectionModel: CleverSectionModel
  ) {
    super();
  }

  public async createSection(body: ISectionPostBody, teacherId: number) {
    try {
      this.logger.debug(
        `Attempting to add section '${body.name}' for teacher with id ${teacherId}`
      );

      let section: ISection | undefined;
      await this.db.transaction(async () => {
        const joinCode = this.generateJoinCode(body.name);
        // Transactions mantain data integrity when creaing multiple rows
        const [res] = await this.sectionModel.add({
          joinCode,
          active: true,
          gradeId: body.gradeId,
          name: body.name,
          subjectId: body.subjectId,
        });

        await this.teacherModel.add({
          primary: true,
          sectionId: res.id,
          userId: teacherId,
        });

        section = res;
      });
      if (section) return section;
      else throw createError(400, 'Could not create section');
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async addChildToSection(
    joinCode: string,
    sectionId: number,
    studentId: number
  ) {
    try {
      // Get the section with the given id
      const section = await this.sectionModel.get(
        { id: sectionId },
        { first: true }
      );
      // Handle nonexistent section
      if (!section) {
        throw createError(404, 'Invalid section ID');
      }
      // Handle incorrect join code
      if (joinCode !== section.joinCode) {
        throw createError(401, 'Join code is invalid');
      }

      // Connect the student user to the section
      await this.studentModel.add({
        sectionId: section.id,
        userId: studentId,
      });

      return section;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async createGameInstance(body: IRumblePostBody, sectionId: number) {
    try {
      let rumble: IRumble | undefined;
      await this.db.transaction(async () => {
        const joinCode = this.generateJoinCode(
          `${body.numMinutes}-${body.promptId}`
        );
        const [res] = await this.rumbleModel.add({
          joinCode,
          canJoin: false,
          maxSections: 1,
          numMinutes: body.numMinutes,
          promptId: body.promptId,
        });

        await this.rumbleSections.add({
          rumbleId: res.id,
          sectionId,
        });

        rumble = res;
      });
      return rumble;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async startRumble(sectionId: number, rumbleId: number) {
    try {
      // Get the rumble based off of the ID to know the desired game length
      const rumble = await this.rumbleModel.get(
        { id: rumbleId },
        { first: true }
      );

      // Calculate the end time from the game length
      const endTime = this.calculateEndTime(rumble.numMinutes);

      // Update the end time of the given rumble
      await this.rumbleSections.updateEndTime(endTime, sectionId, rumbleId);

      // Return the end time to the user
      return endTime;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  private generateJoinCode(key: string) {
    try {
      this.logger.debug(`Generating join code with key: '${key}'`);

      const joinCode = v5.generate({
        namespace: env.UUID_NAMESPACE,
        value: `${key}-${Date.now()}`,
      }) as string;

      this.logger.debug(`Join code generated for key: '${key}'`);

      return joinCode;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  private calculateEndTime(numMinutes: number): Date {
    return (moment.utc().add(numMinutes, 'm') as unknown) as Date;
  }
}

serviceCollection.addTransient(RumbleService);
