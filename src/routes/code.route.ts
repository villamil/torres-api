import { Router } from "express";
import { CodeController } from "../controllers/code.controller";

export const codeRoute: Router = Router().get(
  "/:code",
  CodeController.getByCode
);
