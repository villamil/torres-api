import { Request, Response } from "express";
import { HttpResponse } from "../utils/httpResponse";
import { WaterService } from "../services/water.service";

export class WaterController {
  static async getAll(req: Request, res: Response) {
    try {
      const water = await WaterService.getAll();
      HttpResponse.success(res, water);
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
      const water = await WaterService.getByUnit(req.params.id);
      HttpResponse.success(res, water);
    } catch (error) {
      HttpResponse.fail(
        res,
        400,
        10001,
        error.message || JSON.stringify(error)
      );
    }
  }

  static async patchWater(req: Request, res: Response) {
    try {
      const water = await WaterService.patchWater(req.params.id, req.body);
      HttpResponse.success(res, water);
    } catch (error) {
      HttpResponse.fail(
        res,
        400,
        10001,
        error.message || JSON.stringify(error)
      );
    }
  }

  static async createWater(req: Request, res: Response) {
    try {
      const water = await WaterService.createWater(req.body);
      HttpResponse.success(res, water);
    } catch (error) {
      HttpResponse.fail(
        res,
        400,
        10001,
        error.message || JSON.stringify(error)
      );
    }
  }

  static async deleteWater(req: Request, res: Response) {
    try {
      const water = await WaterService.deleteWater(req.params.id);
      HttpResponse.success(res, water);
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
