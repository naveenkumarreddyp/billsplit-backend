import { Request, Response } from "express";
import HandleResponse, { ApiResponse } from "../Utility/ResponseHandle";
import LoginService, { ISignInServiceInterface } from "../Services/LoginService";
import { IGetUserAuthInfoRequest } from "../Utility/RequestModifier";

export interface ILoginControllerInterface {
  login(req: Request, res: Response): Promise<any>;
  register(req: Request, res: Response): Promise<any>;
  getuser(req: Request, res: Response): Promise<any>;
  logout(req: Request, res: Response): Promise<any>;
}

class LoginController implements ILoginControllerInterface {
  constructor(private loginService: ISignInServiceInterface) {}

  public async login(req: Request, res: Response): Promise<any> {
    try {
      const serviceInfo = await this.loginService.signIn(req.body);

      let result;
      if (serviceInfo?.message) {
        let accessoptions = {
          domain: process.env.DOMAIN_URL!,
          maxAge: 1000 * 60 * 15, // would expire after 15 minutes
          httpOnly: true, // The cookie only accessible by the web server
          secure: true, // Set to true if your site is served via HTTPS
          path: "/",
          sameSite: "none", // Enforce strict SameSite mode
        } as any;
        let options = {
          domain: process.env.DOMAIN_URL!,
          maxAge: 1000 * 60 * 60 * 24, // would expire after 15 minutes
          httpOnly: true, // The cookie only accessible by the web server
          secure: true, // Set to true if your site is served via HTTPS
          path: "/",
          sameSite: "none", // Enforce strict SameSite mode
        } as any;

        // Set cookie
        res.cookie("access", serviceInfo.acessToken, accessoptions);
        res.cookie("refresh", serviceInfo.refreshToken, options);
        result = HandleResponse.handleResponse(true, 200, serviceInfo.message, null);
      } else {
        result = HandleResponse.handleResponse(false, 400, serviceInfo.error, null);
      }
      return res.send(result);
    } catch (err) {
      console.log(err);
      const result: ApiResponse = HandleResponse.handleResponse(false, 500, "Login failed", null);
      return res.send(result);
    }
  }

  public async register(req: Request, res: Response): Promise<any> {
    try {
      const serviceInfo = await this.loginService.signUp(req.body);
      let result: ApiResponse;

      if (serviceInfo?.message) {
        result = HandleResponse.handleResponse(true, 200, serviceInfo.message, null);
      } else {
        result = HandleResponse.handleResponse(false, 409, serviceInfo.error, null);
      }
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(false, 500, "Register failed", null);
      return res.send(result);
    }
  }

  public async getuser(req: IGetUserAuthInfoRequest, res: Response): Promise<any> {
    try {
      const serviceInfo = await this.loginService.getuserInfo(req.userDetails);

      const result: ApiResponse = HandleResponse.handleResponse(true, 200, "user fetchied sucessfully", serviceInfo);
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(false, 500, "fetch user failed", null);
      return res.send(result);
    }
  }

  public async logout(req: IGetUserAuthInfoRequest, res: Response): Promise<any> {
    try {
      const serviceInfo = await this.loginService.signOut(req.userDetails);
      let result: ApiResponse;

      if (serviceInfo?.message) {
        let accessoptions = {
          domain: process.env.DOMAIN_URL!,
          maxAge: 1000 * 60 * 15, // would expire after 15 minutes
          httpOnly: true, // The cookie only accessible by the web server
          secure: true, // Set to true if your site is served via HTTPS
          path: "/",
          sameSite: "none", // Enforce strict SameSite mode
        } as any;
        let options = {
          domain: process.env.DOMAIN_URL!,
          maxAge: 1000 * 60 * 60 * 24, // would expire after 15 minutes
          httpOnly: true, // The cookie only accessible by the web server
          secure: true, // Set to true if your site is served via HTTPS
          path: "/",
          sameSite: "none", // Enforce strict SameSite mode
        } as any;
        res.clearCookie("access", accessoptions);
        res.clearCookie("refresh", options);
        result = HandleResponse.handleResponse(true, 200, serviceInfo.message, null);
      } else {
        result = HandleResponse.handleResponse(false, 400, "couldn't signout user", null);
      }
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(false, 500, "couldn't logout user", null);
      return res.send(result);
    }
  }
}

export default LoginController;
