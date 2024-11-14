// src/services/MulterService.ts

import multer, { FileFilterCallback, Multer, StorageEngine } from "multer";
import { Request } from "express";
import path from "path";
import fs from "fs";

class MulterService {
  private upload: Multer;

  constructor(private destinationFolder: string = "./public") {
    this.upload = multer({
      storage: this.configureStorage(),
      // Optional: Add other multer options here, such as fileFilter, limits, etc.
      //   fileFilter: this.Filterfile, // Add file filter
      //   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB size limit
    });
  }

  private configureStorage(): StorageEngine {
    return multer.diskStorage({
      destination: (req: Request, file: Express.Multer.File, cb) => {
        if (!fs.existsSync(this.destinationFolder)) {
          fs.mkdirSync(this.destinationFolder, { recursive: true });
        }
        console.log(req.body, file.originalname);
        cb(null, this.destinationFolder);
      },
      filename: (req: Request, file: Express.Multer.File, cb) => {
        console.log(req.body);
        const uniqueSuffix = Date.now() + "-" + file.originalname.split(".")[0];
        const extension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
      },
    });
  }

  /**
   * File filter to allow only image files.
  
  private Filterfile(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  }
 */

  public SingleFileUpload(fieldName: string) {
    return this.upload.single(fieldName);
  }

  public MultiFileUpload(fieldName: string, maxCount?: number) {
    return this.upload.array(fieldName, maxCount);
  }

  public DifferentMultiFileUpload(
    fields: { name: string; maxCount?: number }[]
  ) {
    return this.upload.fields(fields);
  }

  public any() {
    return this.upload.any();
  }
}

export default MulterService;
