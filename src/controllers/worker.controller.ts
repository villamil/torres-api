import { Request, Response } from "express";
import { HttpResponse } from "../utils/httpResponse";
import { WorkerService } from "../services/worker.service";

export class WorkerController {
  static async updateUnits(req: Request, res: Response) {
    const fileData: any = req.files.fileData;
    WorkerService.readFile(fileData.tempFilePath);
    HttpResponse.success(res, { ok: "ok" });
  }
}
