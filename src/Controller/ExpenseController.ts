import { Response } from "express";
import HandleResponse, { ApiResponse } from "../Utility/ResponseHandle";
import { IGetUserAuthInfoRequest } from "../Utility/RequestModifier";
import ExpenseService from "../Services/ExpenseService";

class ExpensesController {
  private ExpenseService: ExpenseService = new ExpenseService();
  constructor() {
    // this.createExpense = this.createExpense.bind(this);
    // this.getExpense = this.getExpense.bind(this);
  }
  public async createExpense(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    let result: ApiResponse;
    try {
      // console.log(req.userDetails)
      const serviceInfo = await this.ExpenseService.addExpense(req.body);
      result = HandleResponse.handleResponse(
        true,
        200,
        "expense created sucessfully",
        serviceInfo
      );
      return res.send(result);
    } catch (err) {
      console.log(err);
      result = HandleResponse.handleResponse(
        false,
        500,
        "failed to create expense",
        null
      );
      res.status(500).send(result);
    }
  }

  public async getExpenses(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    try {
      console.log(req.userDetails);

      const serviceInfo = await this.ExpenseService.getExpensesByGroupId(
        req.params.groupid
      );
      const result: ApiResponse = HandleResponse.handleResponse(
        true,
        200,
        "fetch Expense successfully",
        serviceInfo
      );
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(
        false,
        500,
        "failed to fetch expenses",
        null
      );
      res.status(500).send(result);
    }
  }

  public async getExpensebyId(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    try {
      console.log(req.userDetails);
      // const data: UserDTO = req.body;

      const serviceInfo = await this.ExpenseService.fetchExpensebyId(
        req.params.expenseid
      );
      const result: ApiResponse = HandleResponse.handleResponse(
        true,
        200,
        "fetch expense data successfully",
        serviceInfo
      );
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(
        false,
        500,
        "failed to expense data",
        null
      );
      res.status(500).send(result);
    }
  }
}

export default ExpensesController;
