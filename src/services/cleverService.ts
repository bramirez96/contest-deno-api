import {
  Service,
  serviceCollection,
  Inject,
  CleverClient,
  createError,
  ICleverStudent,
  ICleverTeacher,
  v5,
} from '../../deps.ts';
import env from '../config/env.ts';
import {
  CleverAuthResponseType,
  IAuthResponse,
} from '../interfaces/apiResponses.ts';
import { INewSection, ISection } from '../interfaces/cleverSections.ts';
import { Roles } from '../interfaces/roles.ts';
import { SSOLookups } from '../interfaces/ssoLookups.ts';
import { IOAuthUser } from '../interfaces/users.ts';
import CleverSectionModel from '../models/cleverSections.ts';
import CleverStudentModel from '../models/cleverStudents.ts';
import CleverTeacherModel from '../models/cleverTeachers.ts';
import SSOLookupModel from '../models/ssoLookups.ts';
import UserModel from '../models/users.ts';
import AuthService from './auth.ts';
import BaseService from './baseService.ts';

@Service()
export default class CleverService extends BaseService {
  constructor(
    @Inject('clever') private clever: CleverClient,
    @Inject(AuthService) private authService: AuthService,
    @Inject(UserModel) private userModel: UserModel,
    @Inject(SSOLookupModel) private ssoModel: SSOLookupModel,
    @Inject(CleverSectionModel) private sectionModel: CleverSectionModel,
    @Inject(CleverStudentModel) private studentModel: CleverStudentModel,
    @Inject(CleverTeacherModel) private teacherModel: CleverTeacherModel
  ) {
    super();
  }

  public async authorizeUser(code: string): Promise<CleverAuthResponseType> {
    try {
      // Exchange user's code for a token
      const token = await this.clever.getToken(code);

      // Get user's info from clever
      const rawUser = await this.clever.getCurrentUser(token);
      const { id, type } = rawUser.data; // Pull id for easier use

      // Now we have user info, check if they exist in our database
      const existingUser = await this.userModel.findByCleverId(rawUser.data.id);

      if (existingUser) {
        // If the user exists in our DB, sign them in! Easy!
        const authToken = await this.authService.generateToken(existingUser);
        Reflect.deleteProperty(existingUser, 'password');

        // Return an auth response and user type!
        return {
          actionType: 'SUCCESS',
          userType: type,
          body: { token: authToken, user: existingUser },
        };
      } else {
        // We don't have a user account connected to their clever ID yet!
        // Initialize a variable to hold the user's info when we get it from clever
        let user: ICleverStudent | ICleverTeacher;

        // Get the user's info based on their account type
        if (rawUser.type === 'student') {
          const res = await this.clever.getStudent(id, token);
          user = res.data; // Store it in our pre-initialized variable
        } else if (rawUser.type === 'teacher') {
          const res = await this.clever.getTeacher(id, token);
          user = res.data; // Store it in our pre-initialized variable
        } else {
          // We only support students and teachers! Throw an error on admins/staff!
          throw createError(401, 'Account type not supported');
        }

        // If the user has an email in their clever account, check our
        // user table for an email match. If we find a match, the user
        // needs to merge their existing account!
        if (user.email) {
          // Check for email match
          const userToMerge = await this.userModel.get(
            { email: user.email },
            { first: true }
          );
          if (userToMerge) {
            // If we found a mergable user, return a merge response!!
            return {
              actionType: 'MERGE',
              userType: type,
              body: userToMerge,
            };
          }
        }
        // If all of the above preconditions fail, we know the use does
        // not have an account with us, and as such we must pass their
        // clever info and user type to the frontend to allow them to
        // create a new account in our database. The reason we pass the
        // clever user data is to restrict onboarding friction by making
        // it as easy as possible for our users.
        return {
          actionType: 'NEW',
          userType: type,
          body: user,
        };
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
        // Hash their password
        const hashedPassword = await this.authService.hashPassword(
          body.password
        );
        // Add the user to the database
        user = await this.userModel.add(
          {
            ...body,
            password: hashedPassword,
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

  public async createSection(
    body: Omit<INewSection, 'joinCode'>,
    teacherId: number
  ) {
    try {
      this.logger.debug(
        `Attempting to add section '${body.name}' for teacher with id ${teacherId}`
      );

      let section: ISection | undefined;
      await this.db.transaction(async () => {
        const joinCode = this.generateJoinCode(body);
        // Transactions mantain data integrity when creaing multiple rows
        const [res] = await this.sectionModel.add({ ...body, joinCode });

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

  private generateJoinCode(section: Omit<INewSection, 'joinCode'>) {
    try {
      this.logger.debug(
        `Generating join code for section with name: '${section.name}'`
      );

      const joinCode = v5.generate({
        namespace: env.UUID_NAMESPACE,
        value: `${section.name}-${Date.now()}`,
      }) as string;

      this.logger.debug(`Join code generated for section '${section.name}'`);

      return joinCode;
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
