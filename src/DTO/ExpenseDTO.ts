import { userInfo } from "../Entity/GroupsEntity";

export interface ExpenseDTO {
  expenseName: string;
  totalBill: number;
  paidBy: userInfo;
  splitDetails: userBill[];
  groupId: string;
  contributionType: string;
}

export interface userBill extends userInfo {
  amount: number;
}
