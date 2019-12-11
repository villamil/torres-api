import { Request, Response, NextFunction } from "express";
import passport from "passport";

import { HttpResponse } from "../utils/httpResponse";

import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthController.authenticateUser(req, res, next);

      const userMetadata = await UserService.getUserMetadata(user.id);

      const payload = {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        defaultUnitId: userMetadata.defaultUnitId,
        isOwner: userMetadata.isOwner
      };

      const token = await AuthService.signToken(payload, user.email);
      HttpResponse.success(res, {
        token
      });
    } catch (error) {
      HttpResponse.fail(res, 400, 10001, JSON.stringify(error));
    }
  }

  private static authenticateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "local",
        { session: false },
        async (error, user, info) => {
          if (error) {
            return reject(error);
          } else {
            req.login(user, async loginError => {
              if (loginError) {
                return reject(loginError);
              } else {
                return resolve(user);
              }
            });
          }
        }
      )(req, res, next);
    });
  }
}
