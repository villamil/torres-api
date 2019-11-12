import { Router } from "express";
import { MaintenanceController } from "../controllers/maintenance.controller";

export const maintenanceRoute: Router = Router()
  .get("/", MaintenanceController.getAll)
  .get("/:id", MaintenanceController.getById)
  .patch("/:id", MaintenanceController.patchMaintenance)
  .post("/", MaintenanceController.createMaintenance)
  .delete("/:id", MaintenanceController.deleteMaintenance);
