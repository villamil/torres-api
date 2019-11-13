import { Request, Response } from "express";
import { HttpResponse } from "../utils/httpResponse";

import { UnitService } from "../services/unit.service";

export class CodeController {
  static async getByCode(req: Request, res: Response) {
    try {
      const unit = await UnitService.getByCode(req.params.code);
      if (unit) {
        HttpResponse.success(res, unit);
      } else {
        HttpResponse.fail(res, 400, 10001, "Invalid code.");
      }
    } catch (error) {
      HttpResponse.fail(res, 400, 10001, JSON.stringify(error));
    }
  }
}
