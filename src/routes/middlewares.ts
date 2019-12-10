import { Request, Response, NextFunction } from "express";
import passport from "passport";

import { AuthService } from "../services/auth.service";
import { HttpResponse } from "../utils/httpResponse";

export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  passport.authenticate(
    "jwt",
    { session: false },
    async (error, user, info) => {
      if (info) {
        if (info.name === "TokenExpiredError") {
          console.log("Token is expired");
          return HttpResponse.fail(res, 401, 10002, "Token expired.");
        } else {
          console.log(info.error);
          return HttpResponse.fail(res, 401, 10002, "Failed to authenticate");
        }
      } else if (error) {
        return next(error);
      } else {
        return next();
        // if (req.headers.authorization) {
        //   const token = req.headers.authorization.substring(4);
        // }
      }
    }
  )(req, res, next);
}
