import * as passportJWT from "passport-jwt";
import * as passportLocal from "passport-local";
import * as fs from "fs";
import * as path from "path";

import { CONFIG } from "./config";
import { UserService } from "./services/user.service";
import { AuthService } from "./services/auth.service";

export class PassportConfig {
  static JwtStrategy = passportJWT.Strategy;
  static ExtractJwt = passportJWT.ExtractJwt;
  static LocalStrategy = passportLocal.Strategy;

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
      algorithms: ["RS256"]
    };

    passport.use(
      new PassportConfig.LocalStrategy(
        { usernameField: "email", session: false },
        PassportConfig.authenticateUser
      )
    );
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

  private static async authenticateUser(
    email: string,
    password: string,
    done: any
  ) {
    try {
      const user = await AuthService.validateUser(email, password);
      if (!user) {
        return done(null, false, { message: "Wrong email or password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
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
