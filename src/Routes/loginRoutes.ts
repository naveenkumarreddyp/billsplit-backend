import { Router } from "express";
import LoginController, {
  ILoginControllerInterface,
} from "../Controller/LoginController";
import LoginService from "../Services/LoginService";
import Authentication from "../Middlewares/Authentication";

class LoginRoutes {
  private readonly router: Router;

  constructor(private loginController: ILoginControllerInterface) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router
      .route("/login")
      .post(this.loginController.login.bind(this.loginController));
    this.router
      .route("/register")
      .post(this.loginController.register.bind(this.loginController));
    this.router
      .route("/getUserDetails")
      .get(
        Authentication,
        this.loginController.getuser.bind(this.loginController)
      );
    this.router
      .route("/signout")
      .get(
        Authentication,
        this.loginController.logout.bind(this.loginController)
      );
  }

  public getRoutes(): Router {
    return this.router;
  }
}

// Initialize dependencies outside the class
const loginService = new LoginService();
const loginController = new LoginController(loginService);

export default new LoginRoutes(loginController).getRoutes();
