export interface IRumbleSections extends INewRumbleSections {
  id: number;
  endTime?: Date;
  created_at: Date;
}

export interface INewRumbleSections {
  rumbleId: number;
  sectionId: number;
}
