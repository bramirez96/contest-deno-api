export interface IRumbleSections extends INewRumbleSections {
  id: number;
  end_time?: Date;
  created_at: Date;
  phase?: RumblePhases;
}

export interface INewRumbleSections {
  rumbleId: number;
  sectionId: number;
  start_time?: Date | string;
}

export type RumblePhases = 'INACTIVE' | 'ACTIVE' | 'FEEDBACK' | 'COMPLETE';
