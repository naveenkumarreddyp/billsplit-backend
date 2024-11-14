export interface GroupsEntity {
  groupId: string;
  groupName: string;
  groupUsers: userBalance[];
  totalNumberofUsers: number;
  groupAmount: number;
  createdAt: Date;
  updatedAt: Date | null;
  createdBy: string;
  updatedBy: string | null;
  isActive: number; // new field added for user status
}

export interface userInfo {
  userName: string;
  userId: string;
  userEmail?: string;
}

export interface userBalance extends userInfo {
  balance: number;
}
