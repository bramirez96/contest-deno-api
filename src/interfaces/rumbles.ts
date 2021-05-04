import { RumblePhases } from './rumbleSections.ts';

// TODO update this to include full section instead of this, requires a lot of fe/be work
export interface IRumbleWithSectionInfo extends IRumble {
  sectionName: string;
  sectionId: number;
}

export interface IRumble extends INewRumble {
  id: number;
  created_at: Date;
  end_time?: Date;
  phase: RumblePhases;
}

export interface INewRumble extends IRumblePostBody {
  canJoin: boolean;
  joinCode: string;
  maxSections: number;
}

export interface IRumblePostBody {
  numMinutes: number;
  promptId: number;
  start_time?: Date;
}
