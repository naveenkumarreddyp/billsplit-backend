import { Request, Response } from "express";
import HandleResponse, { ApiResponse } from "../Utility/ResponseHandle";
// import { IUserServiceInterface } from "../Services/UserService";
// import { UserDTO } from "../DTO/ProductDTO";
import { IGetUserAuthInfoRequest } from "../Utility/RequestModifier";
import { UploadFiletoDbService } from "../Services/DBUploadFileService";

class UploadFileController {
  constructor() {}
  public async UploadSingleFile(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    let result: ApiResponse;
    try {
      // console.log(req.userDetails)
      let uploadService = new UploadFiletoDbService();
      await uploadService.storeFileInDB(req, res);
      //   const serviceInfo = await uploadService.storeFileInDB(req, res);
      //   result = HandleResponse.handleResponse(true, 200, serviceInfo);
      //   return res.send(result);
    } catch (err) {
      console.log(err);
      result = HandleResponse.handleResponse(false, 500, "login failed", null);
      res.status(500).send(result);
    }
  }

  public async DownloadSingleFile(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    try {
      console.log(req.userDetails);
      // const data: UserDTO = req.body;
      let uploadService = new UploadFiletoDbService();
      await uploadService.retrieveFileFromDb(req, res);
      //  const serviceInfo = await uploadService.retrieveFileFromDb(req, res);
      //   const result: ApiResponse = HandleResponse.handleResponse(
      //     true,
      //     200,
      //     serviceInfo
      //   );
      //   return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(
        false,
        500,
        "failed to fetch user" + err,
        null
      );
      res.status(500).send(result);
    }
  }
  public async uploadMutliple(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    try {
      console.log(req.userDetails);
      // const data: UserDTO = req.body;
      let uploadService = new UploadFiletoDbService();
      await uploadService.storeMultipleFilesInDB(req, res);
      //  const serviceInfo = await uploadService.retrieveFileFromDb(req, res);
      //   const result: ApiResponse = HandleResponse.handleResponse(
      //     true,
      //     200,
      //     serviceInfo
      //   );
      //   return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(
        false,
        500,
        "failed to fetch user" + err,
        null
      );
      res.status(500).send(result);
    }
  }
}

export default UploadFileController;
