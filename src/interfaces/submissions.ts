export interface ISubmission {
  id: number;
  s3Label: string;
  etag: string;
  transcription: string;
  confidence: number;
  dsScore: number;
  rotation: number;
  userId: number;
  promptId: number;
  createdAt: Date;
}

export interface INewSubmission {
  s3Label: string;
  etag: string;
  transcription: string;
  confidence: number;
  dsScore: number;
  rotation: number;
  userId: number;
  promptId: number;
}

export interface IUploadResponse {
  etag: string;
  s3Label: string;
}
