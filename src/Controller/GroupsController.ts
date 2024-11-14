import { Response } from "express";
import HandleResponse, { ApiResponse } from "../Utility/ResponseHandle";
import { IGetUserAuthInfoRequest } from "../Utility/RequestModifier";
import GroupsService from "../Services/GroupsService";
import ExpenseService from "../Services/ExpenseService";

class GroupsController {
  private GroupsService: GroupsService = new GroupsService();
  private ExpensesService: ExpenseService = new ExpenseService();
  constructor() {
    // this.createGroups = this.createGroups.bind(this);
    // this.getGroups = this.getGroups.bind(this);
  }
  public async createGroup(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    let result: ApiResponse;
    try {
      // console.log(req.userDetails)
      const serviceInfo = await this.GroupsService.addGroups(req.body);
      result = HandleResponse.handleResponse(
        true,
        200,
        "Group created sucessfully",
        serviceInfo
      );
      return res.send(result);
    } catch (err) {
      console.log(err);
      result = HandleResponse.handleResponse(
        false,
        500,
        "failed to create group",
        null
      );
      res.status(500).send(result);
    }
  }

  public async getGroups(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    try {
      console.log(req.userDetails);

      const serviceInfo = await this.GroupsService.fetchGroups(req.body);
      const result: ApiResponse = HandleResponse.handleResponse(
        true,
        200,
        "fetched groups successfully",
        serviceInfo
      );
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(
        false,
        500,
        "failed to fetch groups",
        null
      );
      res.status(500).send(result);
    }
  }

  public async getGroupbyId(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    try {
      console.log(req.userDetails);
      // const data: UserDTO = req.body;

      const serviceInfo = await this.GroupsService.fetchGroupbyId(
        req.params.groupid
      );
      const result: ApiResponse = HandleResponse.handleResponse(
        true,
        200,
        "fetch group data successfully",
        serviceInfo
      );
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(
        false,
        500,
        "failed to fetch group data",
        null
      );
      res.status(500).send(result);
    }
  }
  public async getUserOweorOwed(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    try {
      console.log(req.userDetails);
      // const data: UserDTO = req.body;

      const serviceInfo = await this.GroupsService.userOwedOrOwe(
        req.body.groupId,
        req.body.userId
      );
      const result: ApiResponse = HandleResponse.handleResponse(
        true,
        200,
        "fetch group data successfully",
        serviceInfo
      );
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(
        false,
        500,
        "failed to fetch group data",
        null
      );
      res.status(500).send(result);
    }
  }

  public async getUsersBalance(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    try {
      console.log(req.userDetails);
      // const data: UserDTO = req.body;

      const serviceInfo = await this.GroupsService.groupUsersBalance(
        req.params.groupid
      );
      const result: ApiResponse = HandleResponse.handleResponse(
        true,
        200,
        "fetch group data successfully",
        serviceInfo
      );
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(
        false,
        500,
        "failed to fetch group data",
        null
      );
      res.status(500).send(result);
    }
  }
  public async getUserGroupBalances(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    try {
      console.log(req.userDetails);
      // const data: UserDTO = req.body;

      const serviceInfo = await this.GroupsService.userGroupBalance(
        req.body.groupId,
        req.body.userId
      );
      const result: ApiResponse = HandleResponse.handleResponse(
        true,
        200,
        "fetch group data successfully",
        serviceInfo
      );
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(
        false,
        500,
        "failed to fetch group data",
        null
      );
      res.status(500).send(result);
    }
  }

  public async getUserHomeInfo(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const serviceInfo = await this.GroupsService.userHomeInfo(
        req.params.userId
      );
      const result: ApiResponse = HandleResponse.handleResponse(
        true,
        200,
        "fetch group data successfully",
        serviceInfo
      );
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(
        false,
        500,
        "failed to fetch group data",
        null
      );
      res.status(500).send(result);
    }
  }
  public async getUserHomeBarGraph(
    req: IGetUserAuthInfoRequest,
    res: Response
  ) {
    try {
      const serviceInfo = await this.ExpensesService.getHomeBarGraph(
        req.params.userId
      );
      const result: ApiResponse = HandleResponse.handleResponse(
        true,
        200,
        "fetch group data successfully",
        serviceInfo
      );
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(
        false,
        500,
        "failed to fetch group data",
        null
      );
      res.status(500).send(result);
    }
  }
  public async getUserHomePieChart(
    req: IGetUserAuthInfoRequest,
    res: Response
  ) {
    try {
      const serviceInfo = await this.ExpensesService.getHomePieChart(
        req.params.userId
      );
      const result: ApiResponse = HandleResponse.handleResponse(
        true,
        200,
        "fetch group data successfully",
        serviceInfo
      );
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(
        false,
        500,
        "failed to fetch group data",
        null
      );
      res.status(500).send(result);
    }
  }
}

export default GroupsController;
