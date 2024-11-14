// Status Enum
export enum Status {
  Pending = "pending",
  Rejected = "rejected",
  Accepted = "accepted",
  Hidden = "hidden",
}
export enum RequestMethods {
  SMS = "sms",
  Email = "email",
}

// Friends Collection
export interface FriendsEntity {
  friendRequestId: string;
  user1Id: string;
  user1Name: string;
  user1Email: string;
  user2Id: string;
  user2Name: string;
  user2Email: string;
  status: Status;
  requestMethod?: RequestMethods[];
  createdAt: Date;
  updatedAt?: Date;
  isActive: number;
}
