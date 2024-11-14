// import { Request, Response } from "express";
// import HandleResponse, { ApiResponse } from "../Utility/ResponseHandle";
// import { IUserServiceInterface } from "../Services/UserService";
// import { UserDTO } from "../DTO/ProductDTO";
// import { IGetUserAuthInfoRequest } from "../Utility/RequestModifier";

// export interface IUserControllerInterface {
//   createUser(req: IGetUserAuthInfoRequest, res: Response): Promise<ApiResponse>;
//   getUser(req: IGetUserAuthInfoRequest, res: Response): Promise<ApiResponse>;
// }

// class UserController implements IUserControllerInterface {
//   constructor(private userService: IUserServiceInterface) {}
//   public async createUser(
//     req: IGetUserAuthInfoRequest,
//     res: Response
//   ): Promise<any> {
//     let result: ApiResponse;
//     try {
//       console.log(req.userDetails);
//       const serviceInfo = await this.userService.addUser(req.body);
//       result = HandleResponse.handleResponse(true, 200, serviceInfo);
//       return res.send(result);
//     } catch (err) {
//       console.log(err);
//       result = HandleResponse.handleResponse(false, 500, "login failed");
//       res.status(500).send(result);
//     }
//   }

//   public async getUser(
//     req: IGetUserAuthInfoRequest,
//     res: Response
//   ): Promise<any> {
//     try {
//       console.log(req.userDetails);

//       const serviceInfo = await this.userService.fetchUser();
//       const result: ApiResponse = HandleResponse.handleResponse(
//         true,
//         200,
//         serviceInfo
//       );
//       return res.send(result);
//     } catch (err) {
//       const result: ApiResponse = HandleResponse.handleResponse(
//         false,
//         500,
//         "failed to fetch user" + err
//       );
//       res.status(500).send(result);
//     }
//   }
// }

// export default UserController;
