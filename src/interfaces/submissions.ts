import { PutObjectResponse } from '../../deps.ts';

export interface ISubItem {
  id: number;
  userId: number;
  codename: string;
  src: string;
  rotation: number;
  prompt: string;
  score: number;
}

export interface ISubmission extends INewSubmission {
  id: number;
  created_at: Date;
}

export interface INewSubmission extends IDSResponse {
  s3Label: string;
  etag: string;
  userId: number;
  promptId: number;
  sourceId: number;
}

export interface IUploadResponse extends PutObjectResponse {
  s3Label: string;
}

export interface IDSResponse {
  transcription: string;
  confidence: number;
  score: number;
  rotation: number;
}
