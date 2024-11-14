import express, { Response } from "express";
import "dotenv/config";
import cors from "cors";
import AppRoutes from "./src/Routes/RoutesConfig";
import HandleResponse, { ApiResponse } from "./src/Utility/ResponseHandle";
import cookieParser from "cookie-parser";
import helmet from "helmet";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.defaultConfiguration();
    this.routesConfig();
    this.handleUnknownRoutes();
  }

  defaultConfiguration(): void {
    this.app.use(
      cors({
        origin: [process.env.CORS_ORIGIN_URLS!],
        credentials: true,
        methods: "GET,POST,PUT,DELETE",
        allowedHeaders: "Content-Type,Authorization",
      })
    );
    this.app.use(helmet());
    this.app.use(cookieParser());
    this.app.use(express.json());

    this.app.use(express.urlencoded({ extended: true }));
    this.app.get("/", (_, res: Response) => {
      res.status(200).send("server running successfully");
    });
  }

  private routesConfig(): void {
    this.app.use("/api", AppRoutes);
  }
  private handleUnknownRoutes(): void {
    this.app.use((_, res: Response) => {
      let result: ApiResponse = HandleResponse.handleResponse(
        false,
        500,
        "Route (or) Method not found",
        null
      );

      res.send(result);
    });
  }
}

export default new App().app;
