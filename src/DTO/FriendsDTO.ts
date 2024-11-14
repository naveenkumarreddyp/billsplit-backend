import { RequestMethods, Status } from "../Entity/FriendsEntity";

export interface FriendsDTO {
  user1Id: string;
  user1Name: string;
  user1Email: string;
  user2Id: string;
  user2Name: string;
  user2Email: string;
  status: Status;
  requestMethod?: RequestMethods[];
}

export interface GetFriendsDTO {
  userId: string;
  page: number;
  sortBy: string;
  sortOrder: string;
  searchTerm: string;
  status: string;
}
