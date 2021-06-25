export interface ISubItem {
  id: number;
  userId: number;
  codename: string;
  src: string;
  rotation: number;
  prompt: string;
  score: number;
  rumbleId?: number;
}

export interface ISubmission extends INewSubmission {
  id: number;
  created_at: Date;
}

export interface INewSubmission {
  s3Label: string;
  etag: string;
  transcription: string;
  confidence: number;
  score: number;
  rotation: number;
  userId: number;
  promptId: number;
  sourceId?: number;
  rumbleId?: number;
}
