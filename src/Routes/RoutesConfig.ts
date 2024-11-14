import { Router } from "express";
import loginRoutes from "./loginRoutes";
// import userRoutes from "./userRoutes";
import uploadFIleRoutes from "./FIleUploadRoutes";
import productRoutes from "./productRoutes";
import ProductRoutes from "./productRoutes";
import GroupsRoutes from "./GroupsRoutes";
import ExpensesRoutes from "./ExpenseRoutes";
import FriendsRoutes from "./FriendsRoutes";

class AppRoutes {
  private readonly approuter: Router;

  constructor() {
    this.approuter = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.approuter.use("/auth", loginRoutes);
    // this.approuter.use("/file", uploadFIleRoutes);
    this.approuter.use("/groups", new GroupsRoutes().getRoutes());
    this.approuter.use("/expense", new ExpensesRoutes().getRoutes());
    this.approuter.use("/friends", new FriendsRoutes().getRoutes());
  }

  public getRoutes(): Router {
    return this.approuter;
  }
}

export default new AppRoutes().getRoutes();
