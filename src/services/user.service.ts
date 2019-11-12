import { getManager, getRepository, In } from "typeorm";

import { User } from "../models/User.model";

interface ICreateUserData {
  firstName: string;
  lastName: string;
  unit?: string;
}

interface IPatchedUserData {
  firstName?: string;
  lastName?: string;
  unit?: string;
}

export class UserService {
  static createUser(data: ICreateUserData): Promise<User> {
    const manager = getManager();
    const user: User = UserService.getUserData(data);
    return manager.save(user);
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
