import { Router } from "express";
import { userRoute } from "./user.route";
import { unitRoute } from "./unit.route";
import { maintenanceRoute } from "./maintenance.route";
import { waterRoute } from "./water.route";
import { codeRoute } from "./code.route";
import { authRoute } from "./auth.route";
import { userUnitRoute } from "./userUnit.route";
import { workerRoute } from "./worker.route";

import * as MiddleWares from "./middlewares";

interface IRoute {
  path: string;
  handler: Router;
  middleware: any[];
}

export const routes: IRoute[] = [
  {
    path: "/",
    handler: Router().get("/", async (req, res) => res.json("Hi mundosss")),
    middleware: []
  },
  {
    path: "/auth",
    handler: authRoute,
    middleware: []
  },
  {
    path: "/users",
    handler: userRoute,
    middleware: [MiddleWares.authenticateJWT]
  },
  {
    path: "/worker",
    handler: workerRoute,
    middleware: []
  },
  {
    path: "/user-unit",
    handler: userUnitRoute,
    middleware: [MiddleWares.authenticateJWT]
  },
  {
    path: "/units",
    handler: unitRoute,
    middleware: [MiddleWares.authenticateJWT]
  },
  {
    path: "/codes",
    handler: codeRoute,
    middleware: []
  },
  {
    path: "/maintenance",
    handler: maintenanceRoute,
    middleware: [MiddleWares.authenticateJWT]
  },
  {
    path: "/water",
    handler: waterRoute,
    middleware: [MiddleWares.authenticateJWT]
  }
];
