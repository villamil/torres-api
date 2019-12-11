import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { UserController } from "../controllers/user.controller";

export const authRoute: Router = Router()
  .post("/", AuthController.login)
  .post("/signup", UserController.createUser);
