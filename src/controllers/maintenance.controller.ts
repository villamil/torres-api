import { Request, Response } from "express";
import { HttpResponse } from "../utils/httpResponse";
import { MaintenanceService } from "../services/maintenance.service";

export class MaintenanceController {
  static async getAll(req: Request, res: Response) {
    try {
      const maintenance = await MaintenanceService.getAll();
      HttpResponse.success(res, maintenance);
    } catch (error) {
      HttpResponse.fail(
        res,
        400,
        10001,
        error.message || JSON.stringify(error)
      );
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const maintenance = await MaintenanceService.getByUnit(
        req.params.id,
        req.query.limit
      );
      HttpResponse.success(res, maintenance);
    } catch (error) {
      HttpResponse.fail(
        res,
        400,
        10001,
        error.message || JSON.stringify(error)
      );
    }
  }

  static async patchMaintenance(req: Request, res: Response) {
    try {
      const maintenance = await MaintenanceService.patchMaintenance(
        req.params.id,
        req.body
      );
      HttpResponse.success(res, maintenance);
    } catch (error) {
      HttpResponse.fail(
        res,
        400,
        10001,
        error.message || JSON.stringify(error)
      );
    }
  }

  static async createMaintenance(req: Request, res: Response) {
    try {
      const maintenance = await MaintenanceService.createMaintenance(req.body);
      HttpResponse.success(res, maintenance);
    } catch (error) {
      HttpResponse.fail(
        res,
        400,
        10001,
        error.message || JSON.stringify(error)
      );
    }
  }

  static async deleteMaintenance(req: Request, res: Response) {
    try {
      const maintenance = await MaintenanceService.deleteMaintenance(
        req.params.id
      );
      HttpResponse.success(res, maintenance);
    } catch (error) {
      HttpResponse.fail(
        res,
        400,
        10001,
        error.message || JSON.stringify(error)
      );
    }
  }
}
