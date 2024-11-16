import { LoginDTO } from "../DTO/LoginDTO";
import { UserEntity } from "../Entity/UserEntity";
import Repository from "../Repository/BaseRepository";
import TokenManager from "../Utility/JWT_Token";
import PasswordManager from "../Utility/PasswordHashing";
import UniqueIDGenerator from "../Utility/RandomUniqueIdGenerator";
import FriendsService from "./FriendsService";

export interface ISignInServiceInterface {
  getuserInfo(data: any): Promise<any>;
  signIn(data: LoginDTO): Promise<any>;
  signUp(data: LoginDTO): Promise<any>;
  signOut(data: any): Promise<any>;
}

class LoginService implements ISignInServiceInterface {
  private tokenManger: TokenManager;
  private passwordService: PasswordManager;
  private uniqueId: UniqueIDGenerator;
  private friendsService: FriendsService = new FriendsService();
  constructor() {
    this.passwordService = new PasswordManager();
    this.tokenManger = new TokenManager();
    this.uniqueId = new UniqueIDGenerator();
  }

  public async signIn(data: LoginDTO): Promise<any> {
    let userRepository = new Repository(process.env.USER_INFO!);
    let { email, password } = data;
    let userData = await userRepository.getOne({ userEmail: email, isActive: 1 });
    if (!userData) {
      return { error: "user is not registered" };
    }
    let isPasswordValid = await this.passwordService.checkPassword(password, userData.password);
    if (!isPasswordValid) {
      return { error: "Invalid credentials" };
    }

    let { userName, userId } = userData;

    let acessToken = this.tokenManger.generateToken({ userEmail: email, userName, userId }, 24 * 60 * 60 * 1000);
    let refreshToken = this.tokenManger.generateToken(userData._id, 24 * 60 * 60 * 1000);

    return { refreshToken, acessToken, message: "login sucessfully" };
  }

  public async signUp(data: LoginDTO): Promise<any> {
    let userRepository = new Repository(process.env.USER_INFO!);
    let frndRepository = new Repository(process.env.FRIEND_INFO!);
    let { email, password, userName } = data;
    let userData = await userRepository.getOne({ email });
    if (userData) {
      return { error: "Email already in use" };
    }
    let hashedPass = await this.passwordService.hashPassword(password);
    let uid = this.uniqueId.generate();
    let userInfo: UserEntity = {
      userId: uid,
      userName: userName,
      userEmail: email,
      password: hashedPass,
      createdAt: new Date(),
      updatedAt: null,
      createdBy: "Admin",
      updatedBy: null,
      isActive: 1,
    };
    await userRepository.insert(userInfo);
    let updateFrnd = await frndRepository.updateList({ user2Email: email }, { user2Id: uid });
    return { message: "user created sucessfully" };
  }

  public async signOut(data: any): Promise<any> {
    let userRepository = new Repository(process.env.USER_INFO!);
    if (data?.userEmail) {
      let userInfo = await userRepository.getOne({ userEmail: data.userEmail });
      if (userInfo) {
        return { message: "user signed out successfully" };
      }
    }
    throw new Error("signed out failed.");
  }

  public async getuserInfo(data: any): Promise<any> {
    let friendRequestsData = await this.friendsService.getFriendRequestsCount(data?.userId);
    if (friendRequestsData) {
      data["FriendRequestCount"] = friendRequestsData?.length;
    }
    //data["FriendRequestCount"] = Math.floor(Math.random() * 20) + 1;
    //data["FriendRequestCount"] = 0;
    return data;
  }
}

export default LoginService;
