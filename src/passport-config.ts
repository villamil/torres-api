import * as passportJWT from "passport-jwt";
import * as fs from "fs";
import * as path from "path";

import { CONFIG } from "./config";
import { UserService } from "./services/user.service";

export class PassportConfig {
  static JwtStrategy = passportJWT.Strategy;
  static ExtractJwt = passportJWT.ExtractJwt;

  public static init(passport: any): void {
    const PUBLIC_KEY = fs.readFileSync(
      path.join(__dirname, "../", CONFIG.JWT_PUBLIC_KEY),
      "utf8"
    );
    const options = {
      audience: CONFIG.JWT_AUDIENCE,
      issuer: CONFIG.JWT_ISS,
      jwtFromRequest: PassportConfig.ExtractJwt.fromAuthHeaderWithScheme("JWT"),
      secretOrKey: PUBLIC_KEY,
      algorithms: ["HS256"]
    };
    passport.use(
      new PassportConfig.JwtStrategy(options, PassportConfig.authenticate)
    );
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
      try {
        const user = await UserService.getById(id);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    });
  }

  private static async authenticate(jwtPaload: any, done: any) {
    try {
      const user = await UserService.getById(jwtPaload.userId);
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error, false);
    }
  }
}
