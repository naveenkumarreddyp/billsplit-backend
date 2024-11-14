import { Router } from "express";
import FriendsController from "../Controller/FriendsController";

class FriendsRoutes {
  private router: Router;
  private FriendsController: FriendsController = new FriendsController();

  constructor() {
    this.router = Router();
    // this.FriendsController = new FriendsController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.route("/getFriends").post(this.FriendsController.getFriends.bind(this.FriendsController));
    this.router.route("/sendFriendRequest").post(this.FriendsController.SendFriendRequest.bind(this.FriendsController));
    this.router.route("/getFriendRequests/:userId").get(this.FriendsController.getFriendRequests.bind(this.FriendsController));
    this.router.route("/updateFriendRequest").post(this.FriendsController.updateFriendRequest.bind(this.FriendsController));
    this.router.route("/searchFriends").post(this.FriendsController.searchFriends.bind(this.FriendsController));
  }

  public getRoutes(): Router {
    return this.router;
  }
}

export default FriendsRoutes;
