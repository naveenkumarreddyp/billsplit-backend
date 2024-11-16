// import { UserDTO } from "../DTO/FriendsDTO";
import Repository from "../Repository/BaseRepository";
import "dotenv-flow/config";
import UniqueIDGenerator from "../Utility/RandomUniqueIdGenerator";
// import { UserEntity } from "../Entity/UserEntity";
// import PasswordManager from "../Utility/PasswordHashing";
import { FriendsEntity, Status } from "../Entity/FriendsEntity";
import { FriendsDTO, GetFriendsDTO } from "../DTO/FriendsDTO";

class FriendsService {
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

  public async sendFriendRequest(data: FriendsDTO): Promise<any> {
    let friendRepository = new Repository(process.env.FRIEND_INFO!);
    let userRepository = new Repository(process.env.USER_INFO!);
    let userDetails = await userRepository.getOne({ userId: data?.user1Id });
    let friendDetails = await userRepository.getOne({ userEmail: data?.user2Email });

    // Case -1 Already a friend
    let isFriend = await friendRepository.findMany({ status: Status.Accepted, user1Id: data?.user1Id, user2Email: data?.user2Email });
    if (isFriend && isFriend.length > 0) {
      return {
        error: `${data?.user2Name} is already in your friend list`,
      };
    }

    // Case -2 Pending Requests from LoggedIn User to Adding User
    let isFriendreqPending = await friendRepository.findMany({ status: Status.Pending, user1Id: data?.user1Id, user2Email: data?.user2Email });

    if (isFriendreqPending && isFriendreqPending.length > 0) {
      return {
        error: `You already sent friend request to ${data?.user2Name}`,
      };
    }

    // Case -3
    let isRequestedToYou = await friendRepository.findMany({ status: Status.Pending, user1Email: data?.user2Email, user2Email: userDetails?.userEmail });

    if (isRequestedToYou && isRequestedToYou.length > 0) {
      return {
        error: `${data?.user2Name} has already sent friend request to you, Go to Activity Page`,
      };
    }

    let uid = this.uniqueId.generate();
    let frienduid = this.uniqueId.generate();
    let friend: FriendsEntity = {
      friendRequestId: uid,
      user1Id: data?.user1Id,
      user1Name: userDetails?.userName,
      user1Email: userDetails?.userEmail,
      user2Id: friendDetails?.userId ?? frienduid,
      user2Name: data?.user2Name,
      user2Email: data?.user2Email,
      status: Status.Pending,
      requestMethod: data?.requestMethod,
      createdAt: new Date(),
      isActive: 1, // new field added for user status
    };

    let inserFriendRequest = await friendRepository.insert(friend);

    return inserFriendRequest;
  }

  // public async fetchFriends(payloadObj: GetFriendsDTO): Promise<any> {
  //   let friendRepository = new Repository(process.env.FRIEND_INFO!);
  //   let queryObj: any = {};
  //   queryObj["user1Id"] = payloadObj.userId;
  //   if (payloadObj?.status && (payloadObj?.status === "accepted" || payloadObj?.status === "rejected" || payloadObj?.status === "pending")) {
  //     queryObj["status"] = payloadObj?.status;
  //   }
  //   let friends = await friendRepository.findMany(queryObj);
  //   return friends;
  // }
  public async fetchFriends(payloadObj: GetFriendsDTO): Promise<any> {
    const friendRepository = new Repository(process.env.FRIEND_INFO!);
    const queryObj: any = {};
    const page = payloadObj?.page || 0;
    const pageSize = 10; // You can adjust this or make it configurable

    // Base query
    queryObj["user1Id"] = payloadObj?.userId;

    // Status filter
    if (payloadObj?.status && payloadObj?.status !== "all") {
      queryObj["status"] = payloadObj?.status;
    }

    // Search
    if (payloadObj?.searchTerm) {
      queryObj["$or"] = [{ user2Name: { $regex: payloadObj?.searchTerm, $options: "i" } }, { user2Email: { $regex: payloadObj?.searchTerm, $options: "i" } }];
    }

    // Sorting
    let sortOptions: any = {};
    if (payloadObj?.sortBy === "alphabetical") {
      sortOptions["user2Name"] = payloadObj?.sortOrder === "asc" ? 1 : -1;
    } else if (payloadObj?.sortBy === "recent") {
      sortOptions["createdAt"] = payloadObj?.sortOrder === "asc" ? 1 : -1;
    }
    //console.log("----QueryObj---0-", JSON.stringify(queryObj), {}, sortOptions, page * pageSize, pageSize + 1);
    // Fetch friends with pagination
    const friends = await friendRepository.findMany(
      queryObj,
      {},
      sortOptions,
      page * pageSize,
      pageSize + 1 // Fetch one extra to check if there's a next page
    );

    // Check if there's a next page
    const hasNextPage = friends.length > pageSize;
    const friendsToReturn = hasNextPage ? friends.slice(0, -1) : friends;

    return {
      friends: friendsToReturn,
      nextPage: hasNextPage ? page + 1 : undefined,
    };
  }

  public async upadateFriendRequest(friendRequestId: string, status: string): Promise<any> {
    let friendRepository = new Repository(process.env.FRIEND_INFO!);
    let IsfriendOrNot = await friendRepository.findMany({
      friendRequestId,
      status: Status.Pending,
    });
    if (IsfriendOrNot?.length > 0) {
      let friends = await friendRepository.update(
        {
          friendRequestId,
        },
        { status: status, updatedAt: new Date() }
      );

      if (status === "accepted") {
        let friendData = await friendRepository.getOne({
          friendRequestId,
        });
        let uid = this.uniqueId.generate();
        let friend: FriendsEntity = {
          friendRequestId: uid,
          user1Id: friendData.user2Id,
          user1Name: friendData?.user2Name,
          user1Email: friendData?.user2Email,
          user2Id: friendData?.user1Id,
          user2Name: friendData?.user1Name,
          user2Email: friendData?.user1Email,
          status: Status.Accepted,
          createdAt: new Date(),
          isActive: 1, // new field added for user status
        };

        await friendRepository.insert(friend);
      }
      return friends;
    } else {
      return {
        error: "Already updated request",
      };
    }
  }
  // public async getFriendRequests(userId: string): Promise<any> {
  //   let friendRepository = new Repository(process.env.FRIEND_INFO!);
  //   let friends = await friendRepository.findMany({
  //     user2Id: userId,
  //     status: status === "hidden" ? "hidden" : "pending",
  //   });
  //   return friends;
  // }
  public async getFriendRequestsCount(userId: string): Promise<any> {
    let friendRepository = new Repository(process.env.FRIEND_INFO!);
    let friends = await friendRepository.findMany({
      user2Id: userId,
      status: "pending",
    });
    return friends;
  }
  public async getFriendRequests(payloadObj: GetFriendsDTO): Promise<any> {
    let friendRepository = new Repository(process.env.FRIEND_INFO!);
    const queryObj: any = {};
    const page = payloadObj?.page || 0;
    const pageSize = 10; // You can adjust this or make it configurable

    // Base query
    queryObj["user2Id"] = payloadObj?.userId;
    //Pending Status Only
    queryObj["status"] = "pending";
    const friendRequests = await friendRepository.findMany(
      queryObj,
      {},
      {},
      page * pageSize,
      pageSize + 1 // Fetch one extra to check if there's a next page
    );

    // Check if there's a next page
    const hasNextPage = friendRequests.length > pageSize;
    const friendRequestsData = hasNextPage ? friendRequests.slice(0, -1) : friendRequests;

    return {
      friendRequests: friendRequestsData,
      nextPage: hasNextPage ? page + 1 : undefined,
    };
  }

  public async searchFriends(payloadObj: GetFriendsDTO): Promise<any> {
    const friendRepository = new Repository(process.env.FRIEND_INFO!);
    const queryObj: any = {};

    // Base query
    queryObj["user1Id"] = payloadObj?.userId;

    // Status filter
    queryObj["status"] = Status.Accepted;

    // Search
    if (payloadObj?.searchTerm) {
      queryObj["$or"] = [{ user2Name: { $regex: payloadObj?.searchTerm, $options: "i" } }, { user2Email: { $regex: payloadObj?.searchTerm, $options: "i" } }];
    }
    let projectQry: any = {};
    projectQry["_id"] = 0;
    projectQry["userId"] = "$user2Id";
    projectQry["userName"] = "$user2Name";
    projectQry["userEmail"] = "$user2Email";
    const friends = await friendRepository.findMany(queryObj, projectQry);

    return friends;
  }
}

export default FriendsService;
