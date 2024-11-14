// import { UserDTO } from "../DTO/GroupsDTO";
import Repository from "../Repository/BaseRepository";
import "dotenv-flow/config";
import UniqueIDGenerator from "../Utility/RandomUniqueIdGenerator";
// import { UserEntity } from "../Entity/UserEntity";
// import PasswordManager from "../Utility/PasswordHashing";
import { GroupsDTO } from "../DTO/GroupsDTO";
import { GroupsEntity, userBalance, userInfo } from "../Entity/GroupsEntity";

class GroupsService {
  private uniqueId: UniqueIDGenerator;
  // private passwordService: PasswordManager;
  constructor() {
    // Constructor code goes here
    // Initialize any required services or libraries here and configure them
    // Example:
    // this.userService = new UserService(new UserRepository());
    // this.authService = new AuthService();
    this.uniqueId = new UniqueIDGenerator();
    // this.passwordService = new PasswordManager();
  }

  public async addGroups(data: GroupsDTO): Promise<any> {
    let groupRepository = new Repository(process.env.GROUP_INFO!);

    // Generate a unique ID for the user
    let uid = this.uniqueId.generate();
    let usersWithBalance: userBalance[] = data?.groupUsers?.map(
      (user: userInfo) => ({
        ...user,
        balance: 0,
      })
    );

    let group: GroupsEntity = {
      groupId: uid,
      groupName: data?.groupName,
      groupUsers: usersWithBalance,
      totalNumberofUsers: usersWithBalance?.length,
      groupAmount: 0, // calculate group balance
      createdAt: new Date(),
      updatedAt: null,
      createdBy: "Admin",
      updatedBy: null,
      isActive: 1, // new field added for user status
    };
    console.log(data);
    await groupRepository.insert(group);

    return group;
  }

  // public async fetchGroups(userId: string): Promise<any> {
  //   // Example response, modify as needed
  //   let groupRepository = new Repository(process.env.GROUP_INFO!);
  //   let result = await groupRepository.findMany(
  //     { "groupUsers.userId": userId },
  //     {
  //       _id: 0,
  //       groupName: 1,
  //       groupUsers: 1,
  //       groupAmount: 1,
  //       totalNumberofUsers: 1,
  //     }
  //   );

  //   return result;
  // }
  public async fetchGroups(payload: {
    userId: string;
    filter: string;
    page: number;
    limit: number;
    searchTerm: string;
  }): Promise<any> {
    const { userId, filter, page, limit, searchTerm } = payload;
    const groupRepository = new Repository(process.env.GROUP_INFO!);

    let matchObj: any = { "groupUsers.userId": userId };

    if (filter === "owe") {
      matchObj["groupUsers"] = {
        $elemMatch: { userId: userId, balance: { $lt: 0 } },
      };
    } else if (filter === "owed") {
      matchObj["groupUsers"] = {
        $elemMatch: { userId: userId, balance: { $gt: 0 } },
      };
    }

    // Search
    if (searchTerm) {
      matchObj["groupName"] = { $regex: searchTerm, $options: "i" };
    }

    const groups = await groupRepository.findMany(
      matchObj,
      {
        _id: 0,
        groupId: 1,
        groupName: 1,
        groupUsers: 1,
        groupAmount: 1,
        totalNumberofUsers: 1,
      },
      { groupName: 1 },
      page * limit,
      limit + 1 // Fetch one extra to check if there's a next page
    );

    // const totalCount = await groupRepository.count(matchObj);
    // const hasNextPage = (page + 1) * limit < totalCount;
    const hasNextPage = groups.length > limit;
    const groupsToReturn = hasNextPage ? groups.slice(0, -1) : groups;

    return {
      groups: groupsToReturn,
      nextPage: hasNextPage ? page + 1 : null,
      //totalCount,
    };
  }

  public async fetchGroupbyId(groupId: string): Promise<any> {
    // Example response, modify as needed
    let groupRepository = new Repository(process.env.GROUP_INFO!);
    let result = await groupRepository.getOne({ groupId });

    let resultObj = {
      groupId: result?.groupId,
      groupName: result?.groupName,
      groupUsers: result?.groupUsers,
      groupAmount: result?.groupAmount,
      totalNumberofUsers: result?.totalNumberofUsers,
    };
    return resultObj;
  }

  public async userOwedOrOwe(groupId: string, userId: string): Promise<any> {
    // Move repository instances outside if used frequently across functions
    const groupRepository = new Repository(process.env.GROUP_INFO!);
    const expenseRepository = new Repository(process.env.EXPENSE_INFO!);

    // Fetch group information only once
    const result = await groupRepository.getOne({ groupId });
    const otherUsers =
      result?.groupUsers?.filter((user: userInfo) => user.userId !== userId) ||
      [];

    // Prepare aggregation queries in parallel using Promise.all
    const userBalances = await Promise.all(
      otherUsers.map(async (eachUser: userInfo) => {
        const aggregateQuery = [
          {
            $facet: {
              totalAmountOwed: [
                {
                  $match: {
                    groupId: groupId,
                    paidTouserId: userId,
                    paidByuserId: eachUser?.userId,
                  },
                },
                {
                  $group: {
                    _id: null,
                    totalamountowed: { $sum: "$contributionAmount" },
                  },
                },
                { $project: { _id: 0, totalamountowed: 1 } },
              ],
              totalAmountPaid: [
                {
                  $match: {
                    groupId: groupId,
                    paidByuserId: userId,
                    paidTouserId: eachUser?.userId,
                  },
                },
                {
                  $group: {
                    _id: null,
                    totalamountpaid: { $sum: "$contributionAmount" },
                  },
                },
                { $project: { _id: 0, totalamountpaid: 1 } },
              ],
            },
          },
          {
            $project: {
              userBalance: {
                $subtract: [
                  {
                    $ifNull: [
                      { $arrayElemAt: ["$totalAmountPaid.totalamountpaid", 0] },
                      0,
                    ],
                  },
                  {
                    $ifNull: [
                      { $arrayElemAt: ["$totalAmountOwed.totalamountowed", 0] },
                      0,
                    ],
                  },
                ],
              },
            },
          },
        ];

        // Execute aggregation for each user
        const balanceResult = await expenseRepository.aggregate(aggregateQuery);
        const userBalance = balanceResult?.[0]?.userBalance || 0;

        // Only return non-zero balances
        if (userBalance !== 0) {
          return {
            balance: userBalance,
            userName: eachUser?.userName,
            userId: eachUser?.userId,
          };
        }
        return null;
      })
    );

    // Filter out null values from the result
    return userBalances.filter((balance) => balance !== null);
  }

  public async groupUsersBalance(groupId: string): Promise<any> {
    // Initialize repositories
    const groupRepository = new Repository(process.env.GROUP_INFO!);
    const expenseRepository = new Repository(process.env.EXPENSE_INFO!);

    // Fetch group data and users within the group
    const result = await groupRepository.getOne({ groupId });
    const allUsers: userBalance[] = result?.groupUsers || [];

    // Create an array of promises for concurrent execution
    const balancePromises = allUsers.map(async (eachUser) => {
      // Define the aggregation pipeline
      const aggregateQuery = [
        {
          $facet: {
            totalamountpaid: [
              { $match: { groupId: groupId, paidByuserId: eachUser.userId } },
              {
                $group: {
                  _id: "$expenseId",
                  totalAmountPaid: { $first: "$totalBill" },
                  groupId: { $first: "$groupId" },
                },
              },
              { $project: { _id: 0, totalAmountPaid: 1, groupId: 1 } },
              {
                $group: {
                  _id: "$groupId",
                  groupTotalAmountPaid: { $sum: "$totalAmountPaid" },
                },
              },
              {
                $project: {
                  _id: 0,
                  totalAmountPaidforGroup: "$groupTotalAmountPaid",
                },
              },
            ],
            totalamountowed: [
              { $match: { groupId: groupId, paidTouserId: eachUser.userId } },
              {
                $group: {
                  _id: null,
                  totalAmountOwed: { $sum: "$contributionAmount" },
                },
              },
              { $project: { _id: 0, totalAmountOwed: 1 } },
            ],
          },
        },
        {
          $project: {
            userBalance: {
              $subtract: [
                {
                  $ifNull: [
                    {
                      $arrayElemAt: [
                        "$totalamountpaid.totalAmountPaidforGroup",
                        0,
                      ],
                    },
                    0,
                  ],
                },
                {
                  $ifNull: [
                    { $arrayElemAt: ["$totalamountowed.totalAmountOwed", 0] },
                    0,
                  ],
                },
              ],
            },
          },
        },
      ];

      // Execute the aggregation for each user
      const eachUserBalance = await expenseRepository.aggregate(aggregateQuery);

      // Return user balance details
      return {
        balance: eachUserBalance?.[0]?.userBalance || 0,
        userName: eachUser?.userName,
        userId: eachUser?.userId,
      };
    });

    // Resolve all user balances concurrently
    const resultData = await Promise.all(balancePromises);

    return resultData;
  }

  public async userGroupBalance(groupId: string, userId: string): Promise<any> {
    // single user balance of each group
    // Example response, modify as needed
    let expenseRepository = new Repository(process.env.EXPENSE_INFO!);

    let aggregateQuery = [
      {
        $facet: {
          totalamountpaid: [
            { $match: { groupId: groupId, paidByuserId: userId } },
            {
              $group: {
                _id: "$expenseId",
                totalAmountPaid: {
                  $first: "$totalBill",
                },
                groupId: {
                  $first: "$groupId",
                },
              },
            },
            {
              $project: {
                _id: 0,
                totalAmountPaid: 1,
                groupId: 1,
              },
            },
            {
              $group: {
                _id: "$groupId",
                groupTotalAmountPaid: { $sum: "$totalAmountPaid" },
              },
            },
            {
              $project: {
                _id: 0,
                totalAmountPaidforGroup: "$groupTotalAmountPaid",
              },
            },
          ],
          totalamountowed: [
            {
              $match: { groupId: groupId, paidTouserId: userId },
            },
            {
              $group: {
                _id: null,
                totalAmountOwed: { $sum: "$contributionAmount" },
              },
            },
            { $project: { _id: 0, totalAmountOwed: 1 } },
          ],
        },
      },
      {
        $project: {
          totalPaid: {
            $ifNull: [
              {
                $arrayElemAt: ["$totalamountpaid.totalAmountPaidforGroup", 0],
              },
              0,
            ],
          },
          totalShare: {
            $ifNull: [
              { $arrayElemAt: ["$totalamountowed.totalAmountOwed", 0] },
              0,
            ],
          },
        },
      },
    ];
    let userBalance = await expenseRepository.aggregate(aggregateQuery);

    return userBalance?.[0];
  }

  public async updateUserBalances(groupId: string): Promise<any> {
    // update user balances based on expenses
    // Example response, modify as needed

    let groupRepository = new Repository(process.env.GROUP_INFO!);
    let expenseRepository = new Repository(process.env.EXPENSE_INFO!);
    // let result = await groupRepository.getOne({ groupId });
    // let allUsers: userBalance[] = result?.groupUsers;
    let usersBalancesData = await this.groupUsersBalance(groupId);
    let getGroupExpenseAmount = await expenseRepository.aggregate([
      {
        $match: {
          groupId,
        },
      },
      {
        $group: {
          _id: "$expenseId",
          eachExpensetotalBill: { $first: "$totalBill" },
          groupId: { $first: "$groupId" },
        },
      },
      {
        $project: {
          _id: 0,
          eachExpensetotalBill: 1,
          groupId: 1,
        },
      },
      {
        $group: {
          _id: "$groupId",
          groupTotalAmount: { $sum: "$eachExpensetotalBill" },
          groupId: { $first: "$groupId" },
        },
      },
      {
        $project: {
          _id: 0,
          groupTotalAmount: 1,
          groupId: 1,
        },
      },
    ]);

    let updatedresult = await groupRepository.update(
      { groupId },
      {
        groupUsers: usersBalancesData,
        groupAmount: getGroupExpenseAmount?.[0]?.groupTotalAmount,
      }
    );
  }

  public async userHomeInfo(userId: string): Promise<any> {
    let groupRepository = new Repository(process.env.GROUP_INFO!);

    let aggregateQuery = [
      {
        $facet: {
          totalAmountOwing: [
            {
              $match: {
                "groupUsers.userId": userId,
              },
            },
            {
              $unwind: "$groupUsers",
            },
            {
              $match: {
                "groupUsers.userId": userId,
                "groupUsers.balance": { $lt: 0 }, // Only consider negative balances
              },
            },
            {
              $group: {
                _id: "$groupUsers.userId",
                totalNegativeBalance: { $sum: "$groupUsers.balance" },
              },
            },
            {
              $project: {
                _id: 0,
                totalNegativeBalance: 1,
              },
            },
          ],
          totalAmountOwed: [
            {
              $match: {
                "groupUsers.userId": userId,
              },
            },
            {
              $unwind: "$groupUsers",
            },
            {
              $match: {
                "groupUsers.userId": userId,
                "groupUsers.balance": { $gt: 0 }, // Only consider positive balances
              },
            },
            {
              $group: {
                _id: "$groupUsers.userId",
                totalPositiveBalance: { $sum: "$groupUsers.balance" },
              },
            },
            {
              $project: {
                _id: 0,
                totalPositiveBalance: 1,
              },
            },
          ],
          totalgroups: [
            {
              $match: {
                "groupUsers.userId": userId,
              },
            },
            {
              $group: {
                _id: null,
                totalGroups: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                totalGroups: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          amountOwing: {
            $ifNull: [
              {
                $arrayElemAt: ["$totalAmountOwing.totalNegativeBalance", 0],
              },
              0,
            ],
          },
          amountOwed: {
            $ifNull: [
              { $arrayElemAt: ["$totalAmountOwed.totalPositiveBalance", 0] },
              0,
            ],
          },
          totalGroups: {
            $ifNull: [{ $arrayElemAt: ["$totalgroups.totalGroups", 0] }, 0],
          },
        },
      },
    ];
    let userHome = await groupRepository.aggregate(aggregateQuery);
    return userHome[0];
  }
}

export default GroupsService;
