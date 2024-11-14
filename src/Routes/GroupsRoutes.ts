import { Router } from "express";
import GroupsController from "../Controller/GroupsController";

class GroupsRoutes {
  private router: Router;
  private GroupsController: GroupsController = new GroupsController();

  constructor() {
    this.router = Router();
    // this.GroupsController = new GroupsController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router
      .route("/getGroups/")
      .post(this.GroupsController.getGroups.bind(this.GroupsController));
    this.router
      .route("/createGroup")
      .post(this.GroupsController.createGroup.bind(this.GroupsController));
    this.router
      .route("/getGroup/:groupid")
      .get(this.GroupsController.getGroupbyId.bind(this.GroupsController));
    this.router
      .route("/userOweorOwed")
      .post(this.GroupsController.getUserOweorOwed.bind(this.GroupsController));

    this.router
      .route("/getUsersBalance/:groupid")
      .get(this.GroupsController.getUsersBalance.bind(this.GroupsController));
    this.router
      .route("/getUserGroupBalance")
      .post(
        this.GroupsController.getUserGroupBalances.bind(this.GroupsController)
      );
    this.router
      .route("/home/userData/:userId")
      .get(this.GroupsController.getUserHomeInfo.bind(this.GroupsController));
    this.router
      .route("/home/graphbar/:userId")
      .get(
        this.GroupsController.getUserHomeBarGraph.bind(this.GroupsController)
      );
    this.router
      .route("/home/piechart/:userId")
      .get(
        this.GroupsController.getUserHomePieChart.bind(this.GroupsController)
      );
  }

  public getRoutes(): Router {
    return this.router;
  }
}

export default GroupsRoutes;
