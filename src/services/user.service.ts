import { getManager, getRepository, In } from "typeorm";
import * as bcrypt from "bcrypt";

import { User } from "../models/User.model";
import { UnitService } from "./unit.service";

interface ICreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  code: string;
  unit?: string;
}

interface IPatchedUserData {
  firstName?: string;
  lastName?: string;
  unit?: string;
}

export class UserService {
  static async createUser(data: ICreateUserData): Promise<User> {
    try {
      const manager = getManager();
      const user: User = new User();
      user.firstName = data.firstName;
      user.lastName = data.lastName;

      const unit = await UnitService.getByCode(data.code);

      if (!unit) {
        throw new Error("Unit doesn't exist ");
      }

      const alredyRegistered = await UserService.getByEmail(data.email);
      if (alredyRegistered) {
        throw new Error("Email already taken.");
      } else {
        user.email = data.email;
      }

      const passwordHash: string = await UserService.generateHash(
        data.password
      );
      if (!passwordHash) {
        throw new Error("Couldn't generate password");
      } else {
        user.password = passwordHash;
      }

      const newUser = await manager.save(user);

      if (unit.ownerCode === data.code) {
        await UnitService.addOwner(unit.id, user.id);
      } else {
        await UnitService.addTenant(unit.id, user.id);
      }

      return newUser;
    } catch (error) {
      throw new Error(
        "Couldn't create user: " + error.message || JSON.stringify(error)
      );
    }
  }

  static getAll(): Promise<User[]> {
    return getRepository(User).find({
      where: {
        deleted: false
      }
    });
  }

  static getById(id: string): Promise<User> {
    return getRepository(User).findOne({
      where: {
        id,
        deleted: false
      }
    });
  }

  static getByEmail(email: string): Promise<User> {
    return getRepository(User).findOne({
      where: {
        email,
        deleted: false
      }
    });
  }

  static async patchUser(id: string, data: IPatchedUserData): Promise<User> {
    const manager = getManager();
    const repository = getRepository(User);
    let user: User = await repository.findOne({
      where: {
        id,
        deleted: false
      }
    });
    if (user) {
      user = UserService.getUserData(data, user);
      return manager.save(user);
    }

    return user;
  }

  static async deleteUser(id: string): Promise<User> {
    const repository = getRepository(User);
    const user: User = await repository.findOne({
      where: {
        id,
        deleted: false
      }
    });
    if (user) {
      user.deleted = true;
      user.deletedAt = new Date();
      return repository.save(user);
    }
    return user;
  }

  static async findByIdRange(ids: string[]): Promise<User[]> {
    return getRepository(User).find({
      id: In(ids)
    });
  }

  private static generateHash(plainText): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(plainText, 10, (err, hash) => {
        if (hash) {
          resolve(hash);
        } else {
          reject(err);
        }
      });
    });
  }

  private static getUserData(
    data: ICreateUserData | IPatchedUserData,
    existingUser?: User
  ): User {
    const user: User = existingUser || new User();
    Object.keys(data).forEach(key => {
      user[key] = data[key];
    });
    return user;
  }
}
