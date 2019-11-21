import { Request, Response } from "express";
import { HttpResponse } from "../utils/httpResponse";

import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";

export class AuthController {
  static async authenticate(req: Request, res: Response) {
    try {
      const user = await AuthService.authenticate(
        req.body.email,
        req.body.password
      );

      const userMetadata = await UserService.getUserMetadata(user.id);

      const payload = {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      };

      const token = await AuthService.signToken(payload, user.email);
      HttpResponse.success(res, { token, metadata: { ...userMetadata } });
    } catch (error) {
      HttpResponse.fail(res, 400, 10001, JSON.stringify(error));
    }
  }
}
