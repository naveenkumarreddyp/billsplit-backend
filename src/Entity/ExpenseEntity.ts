export interface ExpenseEntity {
  expenseId: string;
  groupId: string;
  expenseName: string;
  totalBill: number;
  paidByuserId: string;
  paidByuserName: string;
  paidTouserId: string;
  paidTouserName: string;
  contributionAmount: number;
  createdAt: Date;
  updatedAt: Date | null;
  createdBy: string;
  updatedBy: string | null;
  isActive: number; // new field added for user status
  contributionType: string;
}
