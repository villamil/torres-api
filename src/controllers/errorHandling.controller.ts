import { Request, Response, NextFunction } from "express";
import { HttpResponse } from "../utils/httpResponse";

export class ErrorHandling {
  static onError(error, req: Request, res: Response, next: NextFunction) {
    const httpCode = error.httpCode || 500;
    const errorCode = error.code || 10000;
    const message = error.message || error.stack;
    HttpResponse.fail(res, httpCode, errorCode, message);
  }
}
