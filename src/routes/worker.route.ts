import { Router } from "express";
import { WorkerController } from "../controllers/worker.controller";

export const workerRoute: Router = Router().post(
  "/",
  WorkerController.updateUnits
);
