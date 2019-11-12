import { Router } from "express";
import { WaterController } from "../controllers/water.controller";

export const waterRoute: Router = Router()
  .get("/", WaterController.getAll)
  .get("/:id", WaterController.getById)
  .patch("/:id", WaterController.patchWater)
  .post("/", WaterController.createWater)
  .delete("/:id", WaterController.deleteWater);
