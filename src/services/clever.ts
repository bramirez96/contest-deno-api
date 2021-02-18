import BaseService from './baseService.ts';
import { Service, serviceCollection, axiod, Base64 } from '../../deps.ts';
import env from '../config/env.ts';
import {
  ICleverSection,
  ICleverStudent,
  ICleverTeacher,
} from '../interfaces/clever.ts';

const api = 'https://api.clever.com/v2.1';
const token = 'somestring'; // THIS NEEDS TO COME FROM SOMEWHERE??? HOW TO DO??

@Service()
export default class CleverService extends BaseService {
  constructor() {
    super();
  }

  // private async getSectionsForTeacher(
  //   token: string,
  //   teacherId: string
  // ): Promise<{ data: ICleverSection; uri: string }[]> {
  //   try {
  //     const res = await axiod.get(
  //       `https://api.clever.com/v2.1/teachers/${teacherId}/sections`,
  //       { headers: { Authorization: 'Bearer ' + token } }
  //     );
  //     return res.data.data;
  //   } catch (err) {
  //     this.logger.error(`Error loading sections for ${teacherId}`);
  //     this.logger.error(err);
  //     throw err;
  //   }
  // }

  // private async getStudentById(
  //   token: string,
  //   sectionId: string
  // ): Promise<{ data: ICleverStudent; uri: string }[]> {
  //   const { data } = await axiod.get(
  //     'https://api.clever.com/v2.1/sections/' + sectionId + '/students',
  //     { headers: { Authorization: 'Bearer ' + token } }
  //   );
  //   return data.data;
  // }

  // public async generateRoster(token: string, teacherId: string) {
  //   const sections = await this.getSectionsForTeacher(token, teacherId);
  //   console.log('sections: ', sections);
  //   for await (const sec of sections) {
  //     for await (const studentId of sec.data.students) {
  //       const student = await this.getStudentById(token, studentId);
  //       console.log({ student });
  //     }
  //   }
  // }

  public async loginWithRedirectCode(code: string) {
    const Authorization =
      'Basic ' +
      Base64.fromString(`${env.CLEVER_CONFIG.ID}:${env.CLEVER_CONFIG.SECRET}`);
    try {
      const { data } = await axiod.post(
        'https://clever.com/oauth/tokens',
        {
          code,
          grant_type: 'authorization_code',
          redirect_uri: env.CLEVER_CONFIG.REDIRECT,
        },
        { headers: { Authorization } }
      );

      const token = data.access_token;
      // console.log({ token });

      const x = await axiod.get('https://api.clever.com/v2.1/me', {
        headers: { Authorization: 'Bearer ' + token },
      });
      console.log(x.data, { code, token });
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  // These are redone functions for a potential library
  public async getTeacher(
    teacherId: string
  ): Promise<{ data: ICleverTeacher; links: { rel: string; uri: string }[] }> {
    try {
      const { data } = await axiod.get(`${api}/teachers/${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async getSectionsByTeacher(
    teacherId: string
  ): Promise<{
    data: ICleverSection[];
    links: { rel: string; uri: string }[];
  }> {
    try {
      const { data } = await axiod.get(
        `${api}/teachers/${teacherId}/sections`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async getSectionById(
    sectionId: string
  ): Promise<{ data: ICleverSection; links: { rel: string; uri: string }[] }> {
    try {
      const { data } = await axiod.get(`${api}/sections/${sectionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async getStudentsBySection(
    sectionId: string
  ): Promise<{
    data: { data: ICleverStudent; uri: string }[];
    links: { rel: string; uri: string }[];
  }> {
    try {
      const { data } = await axiod.get(
        `${api}/sections/${sectionId}/students`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async getStudentById(
    studentId: string
  ): Promise<{
    data: ICleverStudent;
    links: { rel: string; uri: string }[];
  }> {
    try {
      const { data } = await axiod.get(`${api}/students/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}

serviceCollection.addTransient(CleverService);
