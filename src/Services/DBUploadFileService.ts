import { Db, ObjectId } from "mongodb";
import { Request, Response } from "express";
import { GridFSBucket } from "mongodb";
import Database from "../db";
import { promises as fsPromises } from "fs";
import fs from "fs";
import Repository from "../Repository/BaseRepository";

export class UploadFiletoDbService {
  private dbconn: Database;
  private db!: Db;
  private bucket!: GridFSBucket;

  constructor(private bucketName: string = "defaultBucket") {
    this.dbconn = Database.getInstance();
  }

  private async initializeGridFsDb() {
    console.log("this is from gridfs");
    this.db = await this.dbconn.getDb();
    this.bucket = new GridFSBucket(this.db, { bucketName: this.bucketName });
  }

  public async storeFileInDB(req: Request, res: Response): Promise<any> {
    const { file, body } = req;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    await this.initializeGridFsDb();
    const filename = file.originalname;

    const uploadStream = this.bucket.openUploadStream(filename, {
      metadata: body,
    });

    fs.createReadStream(file.path).pipe(uploadStream);
    // res.writeHead(200, {
    //   "Content-Type": "application/json",
    //   "Transfer-Encoding": "chunked",
    // });

    // let uploadedBytes = 0;
    // const totalBytes = file.size;

    uploadStream.on("data", (chunk) => {
      console.log(`uploaded chunk of length - ${chunk.length}`);
    });

    uploadStream.on("finish", async () => {
      try {
        await fsPromises.unlink(file.path);
        console.log("file was deleted");
      } catch (err) {
        console.error("Error deleting file:", err);
      }

      try {
        res.write(
          JSON.stringify({
            fileId: uploadStream.id,
            msg : "file uploaded successfully"
          })
        );
      } catch (err) {
        res
          .status(500)
          .json({ error: "Error retrieving file metadata", details: err });
      }
      res.end();
    });

    uploadStream.on("error", (err) => {
      res.status(500).json({ error: "Error uploading file", details: err });
    });
  }

  public async retrieveFileFromDb(req: Request, res: Response): Promise<any> {
    //   await this.ensureBucketInitialized();
    const { fileId } = req.params;

    try {
      await this.initializeGridFsDb();
      const downloadStream = this.bucket.openDownloadStream(
        new ObjectId(fileId)
      );
      const fileInfo = await new Repository("defaultBucket.files").getOne({
        _id: new ObjectId(fileId),
      });

      if (!fileInfo) {
        return res.status(404).json({ error: "File not found" });
      }

      // const totalBytes = fileInfo.length;
      // let downloadedBytes = 0;

      downloadStream.on("data", (chunk) => {
        // downloadedBytes += chunk.length;
        res.write(chunk); // Send chunk to client
      });

      downloadStream.on("end", () => {
        res.end();
      });

      downloadStream.on("error", (err) => {
        res.status(500).json({ error: "Error retrieving file", details: err });
      });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving file", details: error });
    }
  }

  // public async retrieveFileFromDb(req: Request, res: Response): Promise<any> {
  //   const { fileId } = req.params;

  //   try {
  //     await this.initializeGridFsDb();

  //     // Fetch the file information from the MongoDB files collection
  //     const fileInfo = await new Repository("defaultBucket.files").getOne({
  //       _id: new ObjectId(fileId),
  //     });

  //     if (!fileInfo) {
  //       return res.status(404).json({ error: "File not found" });
  //     }

  //     const totalBytes = fileInfo.length; // Total file size in bytes
  //     const range = req.headers.range; // Check if the range header is present

  //     if (!range) {
  //       // If no range header, send the entire file
  //       res.setHeader("Content-Length", totalBytes);
  //       // res.setHeader("Content-Type", fileInfo.contentType);
  //       res.setHeader("Content-Type", "video/mp4"); // or whatever your video type is
  //       res.status(206);

  //       const downloadStream = this.bucket.openDownloadStream(
  //         new ObjectId(fileId)
  //       );

  //       downloadStream.pipe(res); // Stream the entire file
  //     } else {
  //       // Parse the range header
  //       const parts = range.replace(/bytes=/, "").split("-");
  //       const start = parseInt(parts[0], 10);
  //       const end = parts[1] ? parseInt(parts[1], 10) : totalBytes - 1;

  //       // Ensure the start and end are within bounds
  //       if (start >= totalBytes || end >= totalBytes) {
  //         return res
  //           .status(416)
  //           .json({ error: "Requested range not satisfiable" });
  //       }

  //       const chunkSize = end - start + 1;

  //       // Set the headers for partial content
  //       res.setHeader("Content-Range", `bytes ${start}-${end}/${totalBytes}`);
  //       res.setHeader("Accept-Ranges", "bytes");
  //       res.setHeader("Content-Length", chunkSize);
  //       res.setHeader("Content-Type", "video/mp4"); // or whatever your video type is
  //       res.status(206);
  //       // res.setHeader("Content-Type", fileInfo.contentType); // Assuming the file has contentType metadata

  //       // Open the download stream for the specific range
  //       const downloadStream = this.bucket.openDownloadStream(
  //         new ObjectId(fileId),
  //         {
  //           start,
  //           end: end + 1, // GridFS is non-inclusive of the end index
  //         }
  //       );

  //       // Pipe the stream to the response
  //       downloadStream.pipe(res);
  //       // Handle errors
  //       downloadStream.on("error", (err) => {
  //         res
  //           .status(500)
  //           .json({ error: "Error retrieving file", details: err });
  //       });
  //     }
  //   } catch (error) {
  //     res.status(500).json({ error: "Error retrieving file", details: error });
  //   }
  // }

  public async storeMultipleFilesInDB(
    req: Request,
    res: Response
  ): Promise<any> {
    const files = req.files as Express.Multer.File[]; // Ensure req.files is an array
    const { body } = req;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    await this.initializeGridFsDb();

    const fileIds: any[] = [];

    const uploadPromises = files.map((file) => {
      return new Promise<void>((resolve, reject) => {
        const filename = file.originalname;

        const uploadStream = this.bucket.openUploadStream(filename, {
          metadata: body,
        });

        fs.createReadStream(file.path).pipe(uploadStream);

        uploadStream.on("data", (chunk) => {
          console.log(
            `uploaded chunk of length - ${chunk.length} for file: ${filename}`
          );
        });

        uploadStream.on("finish", async () => {
          try {
            await fsPromises.unlink(file.path);
            console.log(`file ${filename} was deleted`);
            fileIds.push(uploadStream.id);
            resolve();
          } catch (err) {
            console.error(`Error deleting file ${filename}:`, err);
            reject(err);
          }
        });

        uploadStream.on("error", (err) => {
          console.error(`Error uploading file ${filename}:`, err);
          reject(err);
        });
      });
    });

    try {
      await Promise.all(uploadPromises);
      res.status(200).json({
        fileIds,
      });
    } catch (err) {
      res.status(500).json({ error: "Error uploading files", details: err });
    }
  }
}
