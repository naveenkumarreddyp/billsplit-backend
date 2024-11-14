import { Router } from "express";
import ExpensesController from "../Controller/ExpenseController";

class ExpensesRoutes {
  private router: Router;
  private ExpensesController: ExpensesController = new ExpensesController();

  constructor() {
    this.router = Router();
    // this.ExpensesController = new ExpensesController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.route("/getExpenses/:groupid").get(this.ExpensesController.getExpenses.bind(this.ExpensesController));
    this.router.route("/createExpense").post(this.ExpensesController.createExpense.bind(this.ExpensesController));
    this.router.route("/getExpenseDetails/:expenseid").get(this.ExpensesController.getExpensebyId.bind(this.ExpensesController));
  }

  public getRoutes(): Router {
    return this.router;
  }
}

export default ExpensesRoutes;
