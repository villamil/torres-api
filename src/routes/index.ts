import { Router } from "express";
import { userRoute } from "./user.route";
import { unitRoute } from "./unit.route";
import { maintenanceRoute } from "./maintenance.route";
import { waterRoute } from "./water.route";
import { codeRoute } from "./code.route";
import { authRoute } from "./auth.route";
import { userUnitRoute } from "./userUnit.route";
import { workerRoute } from "./worker.route";
import { connectDB } from "../db";

interface IRoute {
  path: string;
  handler: Router;
  middleware: any[];
}

export const routes: IRoute[] = [
  {
    path: "/",
    handler: Router().get("/", async (req, res) => {
      try {
        const connection = await connectDB();
        console.log(connection);
        res.json("Hi mundosss");
      } catch (error) {
        res.json("No se conecto :(");
      }
    }),
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
    middleware: []
  },
  {
    path: "/worker",
    handler: workerRoute,
    middleware: []
  },
  {
    path: "/user-unit",
    handler: userUnitRoute,
    middleware: []
  },
  {
    path: "/units",
    handler: unitRoute,
    middleware: []
  },
  {
    path: "/codes",
    handler: codeRoute,
    middleware: []
  },
  {
    path: "/maintenance",
    handler: maintenanceRoute,
    middleware: []
  },
  {
    path: "/water",
    handler: waterRoute,
    middleware: []
  }
];
