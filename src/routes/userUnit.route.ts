import { Router } from "express";
import { UserUnitController } from "../controllers/userUnit.controller";

export const userUnitRoute: Router = Router()
  .post("/:id", UserUnitController.changeUserPermission)
  .delete("/:id", UserUnitController.deleteUser);
