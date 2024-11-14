import { Router } from "express";
import Authentication from "../Middlewares/Authentication";
import MulterService from "../Utility/MulterConfig";

import UploadFileController from "../Controller/UploadFileController";

class UploadFIleRoutes {
  private router: Router;
  private mutlerUpload: MulterService;
  private uploadController: UploadFileController = new UploadFileController();
  constructor() {
    this.router = Router();
    this.mutlerUpload = new MulterService();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router
      .route("/upload")
      .post(
        this.mutlerUpload.SingleFileUpload("profilepic"),
        this.uploadController.UploadSingleFile
      );
    this.router
      .route("/uploadMulti")
      .post(
        this.mutlerUpload.MultiFileUpload("profilepic"),
        this.uploadController.uploadMutliple
      );
    this.router
      .route("/download/:fileId")
      .get(this.uploadController.DownloadSingleFile);
  }

  public getRoutes(): Router {
    return this.router;
  }
}

// Initialize dependencies outside the class

export default new UploadFIleRoutes().getRoutes();
