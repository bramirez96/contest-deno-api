export interface ISSOLookup extends INewSSOLookup {
  id: number;
}

export interface INewSSOLookup {
  accessToken: string;
  providerId: number;
  userId: number;
}
