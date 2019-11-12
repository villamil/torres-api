import { Router } from "express";
import { UnitController } from "../controllers/unit.controller";

export const unitRoute: Router = Router()
  .get("/", UnitController.getAll)
  .get("/:id", UnitController.getById)
  .patch("/:id", UnitController.patchUnit)
  .post("/", UnitController.createUnit)
  .delete("/", UnitController.deleteUnit);
