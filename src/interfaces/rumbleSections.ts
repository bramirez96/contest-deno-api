export interface IRumbleSections extends INewRumbleSections {
  id: number;
  created_at: Date;
  phase?: RumblePhases;
}

export interface INewRumbleSections {
  rumbleId: number;
  sectionId: number;
  start_time?: Date | string;
  end_time?: Date;
}

export type RumblePhases = 'INACTIVE' | 'ACTIVE' | 'FEEDBACK' | 'COMPLETE';
