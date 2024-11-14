import { NextFunction, Response } from "express";
import HandleResponse, { ApiResponse } from "../Utility/ResponseHandle";
import { IGetUserAuthInfoRequest } from "../Utility/RequestModifier";
import TokenManager from "../Utility/JWT_Token";
import { JwtPayload } from "jsonwebtoken";

class AuthenticateUser {
  public userAuth(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
    try {
      // console.log("refresh", req.cookies.refresh);
      // console.log("access", req.cookies.access);
      let Token = req.cookies.access;
      if (!Token) {
        const result: ApiResponse = HandleResponse.handleResponse(false, 401, "Unauthorized access", null);
        return res.status(401).send(result);
      }
      let decodeTOken = new TokenManager().verifyToken(Token);
      // console.log("----decoded----", decodeTOken);
      if (!decodeTOken) {
        const result: ApiResponse = HandleResponse.handleResponse(false, 401, "Unauthorized access", null);
        return res.status(401).send(result);
      }
      req["userDetails"] = (decodeTOken as JwtPayload).data;
      next();
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(false, 500, "Authentication failed", null);
      return res.send(result);
    }
  }
}

export default new AuthenticateUser().userAuth;
