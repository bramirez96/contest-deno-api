export interface IRumbleSections extends INewRumbleSections {
  id: number;
  end_time?: Date;
  created_at: Date;
}

export interface INewRumbleSections {
  rumbleId: number;
  sectionId: number;
}
