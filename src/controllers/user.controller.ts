import { Request, Response } from "express";
import { HttpResponse } from "../utils/httpResponse";

import { UserService } from "../services/user.service";

export class UserController {
  static async getAll(req: Request, res: Response) {
    try {
      const users = await UserService.getAll();
      HttpResponse.success(res, users);
    } catch (error) {
      HttpResponse.fail(res, 400, 10001, JSON.stringify(error));
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const user = await UserService.getById(req.params.id);
      HttpResponse.success(res, user);
    } catch (error) {
      HttpResponse.fail(res, 400, 10001, JSON.stringify(error));
    }
  }

  static async patchUser(req: Request, res: Response) {
    try {
      const user = await UserService.patchUser(req.params.id, req.body);
      HttpResponse.success(res, user);
    } catch (error) {
      HttpResponse.fail(res, 400, 10001, JSON.stringify(error));
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const user = await UserService.createUser(req.body);
      HttpResponse.success(res, user);
    } catch (error) {
      HttpResponse.fail(
        res,
        400,
        10001,
        error.message || JSON.stringify(error)
      );
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const user = await UserService.deleteUser(req.params.id);
      HttpResponse.success(res, user);
    } catch (error) {
      HttpResponse.fail(res, 400, 10001, JSON.stringify(error));
    }
  }
}
