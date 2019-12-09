import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as fs from "fs";
import * as path from "path";

import { CONFIG } from "../config";
import { UserService } from "./user.service";

export class AuthService {
  static async authenticate(email: string, password: string) {
    const user = await UserService.getByEmail(email);
    if (!user) {
      throw new Error("User doesn't exist");
    }
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new Error("Password doesn't match");
    }
    return user;
  }

  static signToken(payload: any, subject: string): string {
    const PRIVATE_KEY = fs
      .readFileSync(
        path.join(__dirname, "../../", CONFIG.JWT_PRIVATE_KEY),
        "utf8"
      )
      .trim();

    const options: jwt.SignOptions = {
      expiresIn: CONFIG.JWT_EXPIRATION,
      issuer: CONFIG.JWT_ISS,
      audience: CONFIG.JWT_AUDIENCE,
      subject
    };

    return jwt.sign(payload, PRIVATE_KEY, options);
  }

  static verifyToken(token: string): Promise<any> {
    const PUBLIC_KEY = fs
      .readFileSync(
        path.join(__dirname, "../../", CONFIG.JWT_PRIVATE_KEY),
        "utf8"
      )
      .trim();

    return jwt.verify(token, PUBLIC_KEY);
  }
}
