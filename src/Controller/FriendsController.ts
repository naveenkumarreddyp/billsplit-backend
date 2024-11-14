import { Response } from "express";
import HandleResponse, { ApiResponse } from "../Utility/ResponseHandle";
import { IGetUserAuthInfoRequest } from "../Utility/RequestModifier";

import FriendsService from "../Services/FriendsService";

class FriendsController {
  private FriendsService: FriendsService = new FriendsService();
  constructor() {
    // this.createFriends = this.createFriends.bind(this);
    // this.getFriends = this.getFriends.bind(this);
  }
  public async SendFriendRequest(req: IGetUserAuthInfoRequest, res: Response): Promise<any> {
    let result: ApiResponse;
    try {
      // console.log(req.userDetails)
      const serviceInfo = await this.FriendsService.sendFriendRequest(req.body);
      result = HandleResponse.handleResponse(true, 200, "friend request sucessfully", serviceInfo);
      return res.send(result);
    } catch (err) {
      console.log(err);
      result = HandleResponse.handleResponse(false, 500, "failed to send friend request", null);
      res.status(500).send(result);
    }
  }

  public async getFriends(req: IGetUserAuthInfoRequest, res: Response): Promise<any> {
    try {
      const serviceInfo = await this.FriendsService.fetchFriends(req.body);
      const result: ApiResponse = HandleResponse.handleResponse(true, 200, "fetched Friends successfully", serviceInfo);
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(false, 500, "failed to fetch Friends", null);
      res.status(500).send(result);
    }
  }

  public async getFriendRequests(req: IGetUserAuthInfoRequest, res: Response): Promise<any> {
    try {
      console.log(req.userDetails);
      // const data: UserDTO = req.body;

      const serviceInfo = await this.FriendsService.getFriendRequests(req.params.userId);
      const result: ApiResponse = HandleResponse.handleResponse(true, 200, "fetch group data successfully", serviceInfo);
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(false, 500, "failed to fetch group data", null);
      res.status(500).send(result);
    }
  }
  public async updateFriendRequest(req: IGetUserAuthInfoRequest, res: Response): Promise<any> {
    try {
      console.log(req.userDetails);
      // const data: UserDTO = req.body;

      const serviceInfo = await this.FriendsService.upadateFriendRequest(req.body.requestId, req.body.status);
      const result: ApiResponse = HandleResponse.handleResponse(true, 200, "fetch group data successfully", serviceInfo);
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(false, 500, "failed to fetch group data", null);
      res.status(500).send(result);
    }
  }

  public async searchFriends(req: IGetUserAuthInfoRequest, res: Response): Promise<any> {
    try {
      const serviceInfo = await this.FriendsService.searchFriends(req.body);
      const result: ApiResponse = HandleResponse.handleResponse(true, 200, "fetched Friends successfully", serviceInfo);
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(false, 500, "failed to fetch Friends", null);
      res.status(500).send(result);
    }
  }
}

export default FriendsController;
