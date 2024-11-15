// import { UserDTO } from "../DTO/ExpenseDTO";
import Repository from "../Repository/BaseRepository";
import "dotenv-flow/config";
import UniqueIDGenerator from "../Utility/RandomUniqueIdGenerator";

import { ExpenseDTO } from "../DTO/ExpenseDTO";
import { ExpenseEntity } from "../Entity/ExpenseEntity";
import GroupsService from "./GroupsService";
import { DateUtility } from "../Utility/DateUtlity";

class ExpenseService {
  private uniqueId: UniqueIDGenerator;

  constructor() {
    this.uniqueId = new UniqueIDGenerator();
  }

  public async addExpense(data: ExpenseDTO): Promise<any> {
    let expenseRepository = new Repository(process.env.EXPENSE_INFO!);
    let expense: ExpenseEntity[] = [];
    // Generate a unique ID for the user
    let uid = this.uniqueId.generate();

    for (let billDetail of data?.splitDetails) {
      let EachSplit: ExpenseEntity = {
        expenseId: uid,
        expenseName: data?.expenseName,
        totalBill: data?.totalBill,
        contributionType: data?.contributionType,
        paidByuserId: data?.paidBy?.userId,
        paidByuserName: data?.paidBy?.userName,
        paidTouserId: billDetail?.userId,
        paidTouserName: billDetail?.userName,
        contributionAmount: Number(billDetail?.amount),
        groupId: data?.groupId,
        createdAt: new Date(),
        updatedAt: null,
        createdBy: "Admin", // update later for logged in user
        updatedBy: null,
        isActive: 1, // new field added for user status
      };
      expense.push(EachSplit);
    }

    let expenseResult = await expenseRepository.insertList(expense);
    let groupUpadate = await new GroupsService().updateUserBalances(data?.groupId);

    return expenseResult;
  }

  // public async fetchExpenses(groupId: string): Promise<any> {
  //   // Example response, modify as needed
  //   let expenseRepository = new Repository(process.env.EXPENSE_INFO!);
  //   let result = await expenseRepository.findMany({ groupId });

  //   return result;
  // }

  public async fetchExpensebyId(expenseId: string): Promise<any> {
    // Example response, modify as needed
    let expenseRepository = new Repository(process.env.EXPENSE_INFO!);
    let expenseData = await expenseRepository.findMany({ expenseId });
    let result = [];
    for (let expenseObj of expenseData) {
      let projectObj = {
        userName: expenseObj["paidTouserName"],
        contributionAmount: expenseObj["contributionAmount"],
      };
      result.push(projectObj);
    }
    let resultObj = {
      expenseName: expenseData[0].expenseName,
      totalBill: expenseData[0].totalBill,
      paidByuserName: expenseData[0].paidByuserName,
      splitDetails: result,
    };

    return resultObj;
  }
  public async getExpensesByGroupId(groupId: string): Promise<any> {
    // list all expenses of a group
    // Example response, modify as needed
    let expenseRepository = new Repository(process.env.EXPENSE_INFO!);

    let getGroupExpenses = await expenseRepository.aggregate([
      {
        $match: {
          groupId,
        },
      },
      {
        $group: {
          _id: "$expenseId",
          totalBill: { $first: "$totalBill" },
          expenseName: { $first: "$expenseName" },
          paidByuserName: { $first: "$paidByuserName" },
          createdAt: { $first: "$createdAt" },
        },
      },
      {
        $project: {
          _id: 0,
          expenseId: "$_id",
          totalBill: 1,
          expenseName: 1,
          paidByuserName: 1,
          createdAt: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return getGroupExpenses;
  }

  public async getHomeBarGraph(userId: string): Promise<any> {
    let expenseRepository = new Repository(process.env.EXPENSE_INFO!);
    let startingDate = new Date();
    let currentMonth = startingDate.getMonth();
    startingDate.setMonth(currentMonth - 2, 1);
    startingDate.setHours(0, 0, 0, 0);

    let aggregateQuery = [
      {
        $match: {
          createdAt: { $gte: startingDate },
        },
      },
      {
        $facet: {
          totalamountpaid: [
            {
              $match: {
                paidByuserId: userId,
              },
            },
            {
              $group: {
                _id: {
                  Month: { $month: "$createdAt" },
                  Year: { $year: "$createdAt" },
                  expenseId: "$expenseId",
                },
                totalAmountPaid: { $first: "$totalBill" },
              },
            },
            {
              $project: {
                _id: 0,
                Month: "$_id.Month",
                Year: "$_id.Year",
                expenseId: "$_id.expenseId",
                totalAmountPaid: 1,
              },
            },
            {
              $group: {
                _id: {
                  Month: "$Month",
                  Year: "$Year",
                },
                totalAmountPaid: { $sum: "$totalAmountPaid" },
              },
            },
            {
              $project: {
                _id: 0,
                Month: "$_id.Month",
                Year: "$_id.Year",
                totalAmountPaid: 1,
              },
            },
          ],
          yourExpenses: [
            {
              $match: {
                paidTouserId: userId,
              },
            },
            {
              $group: {
                _id: {
                  Month: { $month: "$createdAt" },
                  Year: { $year: "$createdAt" },
                },
                totalExpenses: { $sum: "$contributionAmount" },
              },
            },
            {
              $project: {
                _id: 0,
                Month: "$_id.Month",
                Year: "$_id.Year",
                totalExpenses: 1,
              },
            },
          ],
        },
      },
      // {
      //   $project: {
      //     combined: {
      //       $map: {
      //         input: "$totalamountpaid",
      //         as: "paid",
      //         in: {
      //           Month: "$$paid.Month",
      //           Year: "$$paid.Year",
      //           totalAmountPaid: "$$paid.totalAmountPaid",
      //           totalExpenses: {
      //             $ifNull: [
      //               {
      //                 $arrayElemAt: [
      //                   {
      //                     $map: {
      //                       input: {
      //                         $filter: {
      //                           input: "$yourExpenses",
      //                           as: "expense",
      //                           cond: {
      //                             $and: [
      //                               {
      //                                 $eq: ["$$expense.Month", "$$paid.Month"],
      //                               },
      //                               { $eq: ["$$expense.Year", "$$paid.Year"] },
      //                             ],
      //                           },
      //                         },
      //                       },
      //                       as: "exp",
      //                       in: "$$exp.totalExpenses",
      //                     },
      //                   },
      //                   0,
      //                 ],
      //               },
      //               0,
      //             ],
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
      // {
      //   $unwind: "$combined",
      // },
      // {
      //   $replaceRoot: { newRoot: "$combined" },
      // },
      // {
      //   $sort: {
      //     Year: 1,
      //     Month: 1,
      //   },
      // },
      // {
      //   $project: {
      //     Month: 1,
      //     "You Paid": "$totalAmountPaid",
      //     "Your Expenses": "$totalExpenses",
      //   },
      // },
      {
        $project: {
          allMonths: {
            $setUnion: [
              "$totalamountpaid",
              "$yourExpenses",
              [
                { Month: currentMonth - 1, Year: new Date().getFullYear() },
                { Month: currentMonth, Year: new Date().getFullYear() },
                { Month: currentMonth + 1, Year: new Date().getFullYear() },
              ],
            ],
          },
        },
      },
      {
        $unwind: "$allMonths",
      },
      {
        $group: {
          _id: {
            Month: "$allMonths.Month",
            Year: "$allMonths.Year",
          },
          totalAmountPaid: { $max: "$allMonths.totalAmountPaid" },
          totalExpenses: { $max: "$allMonths.totalExpenses" },
        },
      },
      {
        $project: {
          _id: 0,
          Month: "$_id.Month",
          Year: "$_id.Year",
          "You Paid": { $ifNull: ["$totalAmountPaid", 0] },
          "Your Expenses": { $ifNull: ["$totalExpenses", 0] },
        },
      },
      {
        $sort: {
          Year: 1,
          Month: 1,
        },
      },
    ];
    let getGroupExpenses = await expenseRepository.aggregate(aggregateQuery);
    if (getGroupExpenses.length > 0) {
      const monthsRange = [currentMonth - 1, currentMonth, currentMonth + 1];
      const missingMonths = monthsRange
        .filter((month) => !getGroupExpenses.some((obj) => obj.Month === month))
        .map((month) => ({
          Month: month,
          "You Paid": 0,
          "Your Expenses": 0,
        }));
      getGroupExpenses = [...missingMonths, ...getGroupExpenses];
      const result = [
        ...getGroupExpenses.map((obj) => ({
          ...obj,
          MonthName: DateUtility.getMonthName(obj.Month),
        })),
      ];

      return result;
    }
    return [];
  }
  public async getHomePieChart(userId: string): Promise<any> {
    // list all expenses of a group
    // Example response, modify as needed
    let expenseRepository = new Repository(process.env.EXPENSE_INFO!);

    // --------startingDate always returns the last 2 month and current month till  date -------
    let startingDate = new Date();
    let currentMonth = startingDate.getMonth();
    startingDate.setMonth(currentMonth - 2, 1);
    startingDate.setHours(0, 0, 0, 0);

    let aggregateQuery = [
      {
        $facet: {
          totalamountpaid: [
            {
              $match: {
                paidByuserId: userId,
              },
            },
            {
              $group: {
                _id: {
                  expenseId: "$expenseId",
                },
                totalAmountPaid: { $first: "$totalBill" },
              },
            },
            {
              $project: {
                _id: 0,
                expenseId: "$_id.expenseId",
                totalAmountPaid: 1,
              },
            },
            {
              $group: {
                _id: null,
                totalAmountPaid: { $sum: "$totalAmountPaid" },
              },
            },
            {
              $project: {
                _id: 0,

                totalAmountPaid: 1,
              },
            },
          ],
          yourExpenses: [
            {
              $match: {
                paidTouserId: userId,
              },
            },
            {
              $group: {
                _id: null,
                totalExpenses: { $sum: "$contributionAmount" },
              },
            },
            {
              $project: {
                _id: 0,

                totalExpenses: 1,
              },
            },
          ],
        },
      },
    ];
    let result = await expenseRepository.aggregate(aggregateQuery);
    const formattedResult = [
      {
        name: "Your Expenses",
        value: result[0].yourExpenses[0]?.totalExpenses || 0,
      },
      {
        name: "You Paid",
        value: result[0].totalamountpaid[0]?.totalAmountPaid || 0,
      },
    ];
    return formattedResult;
  }
}

export default ExpenseService;
