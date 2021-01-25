import { PutObjectResponse } from '../../deps.ts';

export interface ISubmission extends INewSubmission {
  id: number;
  createdAt: Date;
}

export interface INewSubmission extends IDSResponse {
  s3Label: string;
  etag: string;
  userId: number;
  promptId: number;
}

export interface IUploadResponse extends PutObjectResponse {
  s3Label: string;
}

export interface IDSResponse {
  transcription: string;
  confidence: number;
  dsScore: number;
  rotation: number;
}
