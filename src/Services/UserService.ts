// // import { UserDTO } from "../DTO/ProductDTO";
// import Repository from "../Repository/BaseRepository";
// import "dotenv-flow/config";
// import UniqueIDGenerator from "../Utility/RandomUniqueIdGenerator";
// import { UserEntity } from "../Entity/UserEntity";
// import PasswordManager from "../Utility/PasswordHashing";

// export interface IUserServiceInterface {
//   addUser(data: UserDTO): Promise<any>;
//   fetchUser(): Promise<any>;
// }

// class UserService implements IUserServiceInterface {
//   private uniqueId: UniqueIDGenerator;
//   private passwordService: PasswordManager;
//   constructor() {
//     // Constructor code goes here
//     // Initialize any required services or libraries here and configure them
//     // Example:
//     // this.userService = new UserService(new UserRepository());
//     // this.authService = new AuthService();
//     this.uniqueId = new UniqueIDGenerator();
//     this.passwordService = new PasswordManager();
//   }

//   public async addUser(data: UserDTO): Promise<any> {
//     let userRepository = new Repository(process.env.USER_INFO!);

//     // Generate a unique ID for the user
//     let uid = this.uniqueId.generate();

//     let user: UserEntity = {
//       userid: uid,
//       name: data?.firstName + " " + data?.lastName,
//       email: data?.email,
//       password: data?.password,
//       createdAt: new Date(),
//       updatedAt: null,
//       createdBy: "Admin",
//       updatedBy: null,
//       isActive: 1,
//     };
//     console.log(data);
//     await userRepository.insert(user);

//     return { message: "created user successfully" };
//   }

//   public async fetchUser(): Promise<any> {
//     // Example response, modify as needed
//     let userRepository = new Repository(process.env.USER_INFO!);
//     let result = await userRepository.getAll();

//     return { message: "sucessful data fetched", result };
//   }
// }

// export default UserService;
