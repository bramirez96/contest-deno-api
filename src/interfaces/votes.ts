export interface IVote extends INewVote {
  id: number;
  createdAt: Date;
}

export interface INewVote {
  userId: number;
  firstPlaceId: number;
  secondPlaceId: number;
  thirdPlaceId: number;
}
