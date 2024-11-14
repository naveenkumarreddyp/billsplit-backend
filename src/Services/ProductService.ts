// import { UserDTO } from "../DTO/ProductDTO";
import Repository from "../Repository/BaseRepository";
import "dotenv-flow/config";
import UniqueIDGenerator from "../Utility/RandomUniqueIdGenerator";
import { UserEntity } from "../Entity/UserEntity";
import PasswordManager from "../Utility/PasswordHashing";

class ProductService {
  private uniqueId: UniqueIDGenerator;
  private passwordService: PasswordManager;
  constructor() {
    // Constructor code goes here
    // Initialize any required services or libraries here and configure them
    // Example:
    // this.userService = new UserService(new UserRepository());
    // this.authService = new AuthService();
    this.uniqueId = new UniqueIDGenerator();
    this.passwordService = new PasswordManager();
  }

  public async addProduct(data: any): Promise<any> {
    let userRepository = new Repository(process.env.PRODUCT_INFO!);

    // Generate a unique ID for the user
    let uid = this.uniqueId.generate();

    let user: any = {
      productid: uid,
      productname: data?.name,
      createdAt: new Date(),
      updatedAt: null,
      createdBy: "Admin",
      updatedBy: null,
    };
    console.log(data);
    await userRepository.insert(user);

    return user;
  }

  public async fetchProduct(): Promise<any> {
    // Example response, modify as needed
    let userRepository = new Repository(process.env.PRODUCT_INFO!);
    let result = await userRepository.findMany({});

    return result;
  }
}

export default ProductService;