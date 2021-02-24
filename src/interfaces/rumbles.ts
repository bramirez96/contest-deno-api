export interface IRumble extends INewRumble {
  id: number;
  created_at: Date;
}

export interface INewRumble extends IRumblePostBody {
  canJoin: boolean;
  joinCode: string;
  maxSections: number;
}

export interface IRumblePostBody {
  numMinutes: number;
  promptId: number;
}
