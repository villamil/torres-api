import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

export const authRoute: Router = Router().post(
  "/",
  AuthController.authenticate
);
