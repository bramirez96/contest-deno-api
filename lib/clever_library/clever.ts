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

    const query = new URLSearchParams({
      response_type: 'code',
      redirect_uri: config.redirectURI,
      client_id: config.clientId,
    }).toString();

    this.buttonURI = 'https://clever.com/oauth/authorize?' + query;
  }
  private api: string;
  private redirectURI: string;
  private basic: string;
  private buttonURI: string;

  public getLoginButtonURI() {
    return this.buttonURI;
  }

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

  public async getCurrentUser(
    token: string
  ): Promise<{
    type: 'teacher' | 'student';
    data: {
      id: string;
      district: string;
      type: 'teacher' | 'student';
      authorized_by: string;
    };
    links: { rel: string; uri: string }[];
  }> {
    try {
      const { data } = await axiod.get(`${this.api}/me`, this.bearer(token));
      return data;
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
      const { data } = await axiod.get(
        `${this.api}/teachers/${teacherId}`,
        this.bearer(token)
      );
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
        this.bearer(token)
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
      const { data } = await axiod.get(
        `${this.api}/sections/${sectionId}`,
        this.bearer(token)
      );
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
        this.bearer(token)
      );
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async getStudent(
    studentId: string,
    token: string
  ): Promise<{
    data: ICleverStudent;
    links: { rel: string; uri: string }[];
  }> {
    try {
      const { data } = await axiod.get(
        `${this.api}/students/${studentId}`,
        this.bearer(token)
      );
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  private bearer(token: string) {
    return { headers: { Authorization: `Bearer ${token}` } };
  }
}
