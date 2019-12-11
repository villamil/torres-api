import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export const userRoute: Router = Router()
  .get("/", UserController.getAll)
  .get("/:id", UserController.getById)
  .patch("/:id", UserController.patchUser);
// .post("/", UserController.createUser);
// .delete("/:userId/unit/:unitId", UserController.deleteUser);
