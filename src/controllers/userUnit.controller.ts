import { Request, Response } from "express";
import { HttpResponse } from "../utils/httpResponse";

import { UnitService } from "../services/unit.service";

export class UserUnitController {
  static async changeUserPermission(req: Request, res: Response) {
    try {
      const unit = await UnitService.changeUserPermission(
        req.params.id,
        req.body.makeAdmin
      );
      HttpResponse.success(res, unit);
    } catch (error) {
      HttpResponse.fail(res, 400, 10001, JSON.stringify(error));
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const unit = await UnitService.removeUser(req.params.id);
      HttpResponse.success(res, unit);
    } catch (error) {
      HttpResponse.fail(res, 400, 10001, JSON.stringify(error));
    }
  }
}
