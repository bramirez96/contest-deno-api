import { axiod, Base64 } from './cleverDeps.ts';
import {
  ICleverConfig,
  ICleverSection,
  ICleverStudent,
  ICleverTeacher,
} from './types.ts';

export default class CleverClient {
  constructor({ apiVersion = 'v2.1', ...config }: ICleverConfig) {
    this.api = `https://api.clever.com/${apiVersion}`;
    this.basic =
      'Basic ' + Base64.fromString(`${config.clientId}:${config.clientSecret}`);
    this.redirectURI = config.redirectURI;
  }
  private api: string;
  private redirectURI: string;
  private basic: string;

  /**
   * Uses the `code` query parameter passed when redirected to a Clever
   * redirect URI to get an access token for subsequent requests.
   *
   * @param code The `code` query param from a Clever redirect link
   */
  public async getToken(code: string): Promise<string> {
    try {
      const { data } = await axiod.post(
        'https://clever.com/oauth/tokens',
        {
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectURI,
        },
        { headers: { Authorization: this.basic } }
      );

      return data.access_token;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async getCurrentUserId(token: string): Promise<string> {
    try {
      const { data } = await axiod.get(`${this.api}/me`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      return data.data.id;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async getTeacher(
    teacherId: string,
    token: string
  ): Promise<{ data: ICleverTeacher; links: { rel: string; uri: string }[] }> {
    try {
      const { data } = await axiod.get(`${this.api}/teachers/${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async getSectionsByTeacher(
    teacherId: string,
    token: string
  ): Promise<{
    data: ICleverSection[];
    links: { rel: string; uri: string }[];
  }> {
    try {
      const { data } = await axiod.get(
        `${this.api}/teachers/${teacherId}/sections`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async getSectionById(
    sectionId: string,
    token: string
  ): Promise<{ data: ICleverSection; links: { rel: string; uri: string }[] }> {
    try {
      const { data } = await axiod.get(`${this.api}/sections/${sectionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async getStudentsBySection(
    sectionId: string,
    token: string
  ): Promise<{
    data: { data: ICleverStudent; uri: string }[];
    links: { rel: string; uri: string }[];
  }> {
    try {
      const { data } = await axiod.get(
        `${this.api}/sections/${sectionId}/students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async getStudentById(
    studentId: string,
    token: string
  ): Promise<{
    data: ICleverStudent;
    links: { rel: string; uri: string }[];
  }> {
    try {
      const { data } = await axiod.get(`${this.api}/students/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
