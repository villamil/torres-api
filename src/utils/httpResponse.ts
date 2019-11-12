import { Response } from "express";

export class HttpResponse {
  static success(res: Response, payload: any): void {
    HttpResponse.send(res, 200, payload);
  }

  static fail(
    res: Response,
    httpCode: number,
    code: number,
    message?: string
  ): void {
    const payload = {
      error: {
        code,
        message
      }
    };

    HttpResponse.send(res, httpCode, payload);
  }

  private static send(res: Response, httpCode: number, payload: any): void {
    try {
      res.status(httpCode).json(payload);
    } catch (error) {
      console.log(`Failed to send ${JSON.stringify(payload)}`, error);
    }
  }
}
