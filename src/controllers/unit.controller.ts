import { Request, Response } from "express";
import { HttpResponse } from "../utils/httpResponse";

import { UnitService } from "../services/unit.service";
import { MaintenanceService } from "../services/maintenance.service";
import { WaterService } from "../services/water.service";

export class UnitController {
  static async getAll(req: Request, res: Response) {
    try {
      const units = await UnitService.getAll();
      HttpResponse.success(res, units);
    } catch (error) {
      HttpResponse.fail(res, 400, 10001, JSON.stringify(error));
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const totalMaintenanceOwed = await MaintenanceService.totalOwed(
        req.params.id
      );
      const totalWaterOwed = await WaterService.totalOwed(req.params.id);
      const unit = await UnitService.getUnitAndUsersById(req.params.id);
      HttpResponse.success(res, {
        ...unit,
        totalMaintenanceOwed,
        totalWaterOwed
      });
    } catch (error) {
      HttpResponse.fail(res, 400, 10001, JSON.stringify(error));
    }
  }

  static async patchUnit(req: Request, res: Response) {
    try {
      const unit = await UnitService.patchUnit(req.params.id, req.body);
      HttpResponse.success(res, unit);
    } catch (error) {
      HttpResponse.fail(
        res,
        400,
        10001,
        error.message || JSON.stringify(error)
      );
    }
  }

  static async createUnit(req: Request, res: Response) {
    try {
      const unit = await UnitService.createUnit(req.body);
      HttpResponse.success(res, unit);
    } catch (error) {
      HttpResponse.fail(
        res,
        400,
        10001,
        error.message || JSON.stringify(error)
      );
    }
  }

  static async deleteUnit(req: Request, res: Response) {
    try {
      const deletedUnit = await UnitService.deleteUnit(req.params.id);
      HttpResponse.success(res, deletedUnit);
    } catch (error) {
      HttpResponse.fail(res, 400, 10001, JSON.stringify(error));
    }
  }

  static async details(req: Request, res: Response) {
    try {
      HttpResponse.success(res, { ok: "hi" });
    } catch (error) {
      HttpResponse.fail(res, 400, 10001, JSON.stringify(error));
    }
  }
}
