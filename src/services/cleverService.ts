import {
  CleverClient,
  createError,
  Inject,
  Service,
  serviceCollection,
} from '../../deps.ts';
import {
  CleverAuthResponseType,
  IAuthResponse,
  ICleverEnumData,
  ISelectOption,
} from '../interfaces/apiResponses.ts';
import { ISectionWithRumbles } from '../interfaces/cleverSections.ts';
import { Roles } from '../interfaces/roles.ts';
import { SSOLookups } from '../interfaces/ssoLookups.ts';
import { IOAuthUser, IUser } from '../interfaces/users.ts';
import CleverStudentModel from '../models/cleverStudents.ts';
import CleverTeacherModel from '../models/cleverTeachers.ts';
import SSOLookupModel from '../models/ssoLookups.ts';
import UserModel from '../models/users.ts';
import AuthService from './auth.ts';
import BaseService from './baseService.ts';
import RumbleService from './rumble.ts';

@Service()
export default class CleverService extends BaseService {
  constructor(
    @Inject('clever') private clever: CleverClient,
    @Inject(UserModel) private userModel: UserModel,
    @Inject(RumbleService) private rumbleService: RumbleService,
    @Inject(AuthService) private authService: AuthService,
    @Inject(SSOLookupModel) private ssoModel: SSOLookupModel,
    @Inject(CleverTeacherModel) private teacherModel: CleverTeacherModel,
    @Inject(CleverStudentModel) private studentModel: CleverStudentModel
  ) {
    super();
  }

  public getLoginButtonURI() {
    const buttonURI = this.clever.getLoginButtonURI();
    return buttonURI;
  }

  public async authorizeUser(code: string): Promise<CleverAuthResponseType> {
    try {
      const response = await this.clever.ssoAuthWithCode<IUser>({
        code,
        getUserByCleverId: this.userModel.findByCleverId,
        getUserByEmail: (email) =>
          this.userModel.get({ email }, { first: true }),
      });

      if (response.status === 'SUCCESS') {
        const authToken = await this.authService.generateToken(response.body);
        Reflect.deleteProperty(response.body, 'password');
        return {
          actionType: response.status,
          body: { token: authToken, user: response.body },
          cleverId: response.cleverId,
          roleId: response.body.roleId,
        };
      } else if (response.status === 'MERGE') {
        return {
          actionType: 'MERGE',
          body: response.body,
          cleverId: response.cleverId,
          roleId: response.body.roleId,
        };
      } else if (response.status === 'NEW') {
        return {
          actionType: 'NEW',
          cleverId: response.cleverId,
          body: response.body,
          roleId: response.userType === 'teacher' ? Roles.teacher : Roles.user,
        };
      } else {
        throw new Error('Could not authenticate with Clever');
      }
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async registerCleverUser(
    body: IOAuthUser,
    userType: string,
    cleverId: string
  ): Promise<IAuthResponse> {
    try {
      this.logger.debug(
        `Attempting to register user with codename ${body.codename}`
      );
      // Figure out the user's role
      let roleId: number;
      if (userType === 'student') roleId = Roles.user;
      else if (userType === 'teacher') roleId = Roles.teacher;
      else throw createError(400, 'Invalid user type');

      // Initialize variables for return values
      let user, token;

      // Attempt to create a user and log them in
      await this.db.transaction(async () => {
        // Sanitize data
        Reflect.deleteProperty(body, 'age');
        Reflect.deleteProperty(body, 'parentEmail');

        // Hash their password
        const hashedPassword = await this.authService.hashPassword(
          body.password
        );
        // Add the user to the database
        user = await this.userModel.add(
          {
            ...body,
            password: hashedPassword,
            isValidated: true,
            roleId,
          },
          true
        );

        await this.ssoModel.add({
          accessToken: cleverId,
          providerId: SSOLookups.Clever,
          userId: user.id,
        });

        // Generate their auth token
        token = await this.authService.generateToken(user);
      });

      // Verify the user was created and logged in successfully
      if (!user || !token) throw createError(401, 'Failed to create user');
      else return { user, token };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async loginAndMerge(
    codename: string,
    password: string,
    cleverId: string
  ): Promise<IAuthResponse> {
    try {
      const { token, user } = await this.authService.SignIn(codename, password);
      await this.ssoModel.add({
        accessToken: cleverId,
        providerId: SSOLookups.Clever,
        userId: user.id,
      });

      return { token, user };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async getUserInfo(
    user: IUser
  ): Promise<{ enumData: ICleverEnumData; sections: ISectionWithRumbles[] }> {
    try {
      const enumData = await this.getEnumData();
      const sections = await this.rumbleService.getSections(user);
      return {
        enumData,
        sections: sections,
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  private async getEnumData(): Promise<ICleverEnumData> {
    const enumMap = (item: Record<string, string>): ISelectOption => {
      const itemId = Object.keys(item).filter((i) => i !== 'id')[0];
      return { value: item.id, label: item[itemId] };
    };
    try {
      // Get and parse the database results for grade enums
      const gradeList = (await this.db.table('enum_grades').execute()) as {
        [key: string]: string;
      }[];
      const grades = gradeList.map(enumMap);

      // and for subject enums
      const subjectList = (await this.db.table('enum_subjects').execute()) as {
        [key: string]: string;
      }[];
      const subjects = subjectList.map(enumMap);

      return { grades, subjects };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  // Long transactional query for automatic rostering. Not currently needed.
  // public async generateRoster(code: string) {
  //   try {
  //     // Exchange the temp code for a bearer token
  //     const token = await this.clever.getToken(code);

  //     // Get the teacher's id from clever
  //     const cleverTeacherId = await this.clever.getCurrentUserId(token);

  //     // Handle verything transactionally! If it fails, roll it ALL
  //     // back for data integrity. This is vital for scalability!
  //     await this.db.transaction(async () => {
  //       // Get the teacher's info from clever
  //       const { data: teacher } = await this.clever.getTeacher(
  //         cleverTeacherId,
  //         token
  //       );
  //       // Create a teacher user in our database
  //       const [{ id: teacherId }] = await this.userModel.add({
  //         email: teacher.email,
  //         firstname: teacher.name.first,
  //         lastname: teacher.name.last,
  //         isValidated: true,
  //         roleId: Roles.teacher,
  //       });
  //       // Add an SSO lookup row for the teacher
  //       await this.ssoModel.add({
  //         accessToken: teacher.id,
  //         providerId: SSOLookups.Clever,
  //         userId: teacherId,
  //       });
  //       // Loop over the teacher's section list
  //       for await (const cleverSectionId of teacher.sections) {
  //         // Get the info for each section
  //         const { data: section } = await this.clever.getSectionById(
  //           cleverSectionId,
  //           token
  //         );
  //         // Add each section to our database
  //         const [{ id: sectionId }] = await this.sectionModel.add({
  //           name: section.name,
  //           gradeId: section.grade,
  //           subjectId: section.subject,
  //         });
  //         // Connect that section to our existing teacher user
  //         await this.teacherModel.add({
  //           primary: true,
  //           sectionId,
  //           userId: teacherId,
  //         });
  //         // Query Clever for a list of all the students in the section
  //         const { data: students } = await this.clever.getStudentsBySection(
  //           cleverSectionId,
  //           token
  //         );
  //         // Create a student and user row for each student
  //         for await (const { data: student } of students) {
  //           // Add the new student user to the database
  //           const [{ id: studentId }] = await this.userModel.add({
  //             firstname: student.name.first,
  //             lastname: student.name.last,
  //             roleId: Roles.user,
  //             isValidated: true,
  //           });
  //           // Add a student row with the newly created id
  //           await this.studentModel.add({
  //             gradeId: student.grade,
  //             userId: studentId,
  //             sectionId,
  //           });
  //           // Add an SSO lookup row for the student
  //           await this.ssoModel.add({
  //             accessToken: student.id,
  //             providerId: SSOLookups.Clever,
  //             userId: studentId,
  //           });
  //         }
  //       }
  //     });
  //   } catch (err) {
  //     this.logger.error(err);
  //     throw err;
  //   }
  // }
}

serviceCollection.addTransient(CleverService);
