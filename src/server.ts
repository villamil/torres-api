import cors from "cors";
import express from "express";
import helmet from "helmet";
import http from "http";
import { Connection } from "typeorm";
import bodyParser from "body-parser";
import * as WebSocket from "ws";
import fileupload from "express-fileupload";
import passport from "passport";

import { routes } from "./routes";
import { PassportConfig } from "./passport-config";
import { ErrorHandling } from "./controllers/errorHandling.controller";
import { connectDB } from "./db";
import { CONFIG } from "./config";

export class Server {
  public wss: WebSocket;
  private readonly app: express.Application;
  private readonly server: http.Server | undefined;
  private connection: Connection | undefined;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server, path: "/status" });
  }

  public async start(): Promise<http.Server | undefined> {
    try {
      this.initExpressApp();
      this.connection = await connectDB();
      for (const route of routes) {
        this.app.use(route.path, route.middleware, route.handler);
      }
      return this.server;
    } catch (error) {
      console.log(error);
    }
  }

  private initExpressApp(): void {
    this.app.use(passport.initialize());
    PassportConfig.init(passport);

    this.app.use(
      fileupload({
        useTempFiles: true,
        tempFileDir: "/tmp/"
      })
    );
    this.app.use(helmet());
    this.app.use(
      cors({
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"]
      })
    );
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(ErrorHandling.onError);
  }
}
