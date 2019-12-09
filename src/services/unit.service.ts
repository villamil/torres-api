import { getManager, getRepository, getConnection } from "typeorm";

import { Unit } from "../models/Unit.model";
import { User } from "../models/User.model";
import { Maintenance } from "../models/Maintenance.model";

import { UserService } from "../services/user.service";
import { UserUnit } from "../models/UserUnit.model";

interface ICreateUnitData {
  number: number;
  section: string;
  reference: number;
  ownerCode?: string;
  owner?: string;
  maintenance?: Maintenance[];
  tenants?: string[];
}

interface IPatchedUnitData {
  number?: number;
  section?: string;
  owner?: string;
  reference?: number;
  maintenance?: Maintenance[];
  tenants?: string[];
}

export class UnitService {
  static async createUnit(data: ICreateUnitData): Promise<Unit> {
    const manager = getManager();
    const unit: Unit = new Unit();
    unit.number = data.number;
    unit.section = data.section;
    unit.reference = data.reference;
    unit.ownerCode = data.ownerCode;

    const unitExists: Unit = await getRepository(Unit).findOne({
      where: {
        number: data.number,
        section: data.section,
        deleted: false
      }
    });

    if (unitExists) {
      return unitExists;
    }

    return manager.save(unit);
  }

  static getAll(): Promise<Unit[]> {
    return getRepository(Unit).find({
      where: {
        deleted: false
      }
    });
  }

  static getById(unitId: string): Promise<Unit> {
    return getRepository(Unit).findOne({
      where: [
        {
          id: unitId,
          deleted: false
        }
      ]
    });
  }

  static getUnitAndUsersById(unitId: string): Promise<Unit> {
    return getRepository(Unit)
      .createQueryBuilder("unit")
      .innerJoinAndSelect("unit.userUnit", "userUnit")
      .innerJoinAndSelect(
        "userUnit.user",
        "user",
        "userUnit.unit.id = :unitId",
        {
          unitId
        }
      )
      .where("userUnit.deleted = false")
      .getOne();
  }

  static getByCode(code: string): Promise<Unit> {
    return getRepository(Unit).findOne({
      where: [
        {
          signUpCode: code,
          deleted: false
        },
        {
          ownerCode: code,
          deleted: false
        }
      ]
    });
  }

  static getUnitsByUser(userId: string): Promise<Unit[]> {
    return getRepository(Unit)
      .createQueryBuilder("unit")
      .innerJoinAndSelect("unit.userUnit", "userUnit")
      .innerJoinAndSelect("userUnit.user", "user", "user.id = :userId", {
        userId
      })
      .where("userUnit.deleted = false")
      .getMany();
  }

  static getByUser(userId: string): Promise<Unit[]> {
    return getRepository(Unit)
      .createQueryBuilder("unit")
      .innerJoinAndSelect("unit.userUnit", "userUnit")
      .innerJoinAndSelect("userUnit.user", "user", "user.id = :userId", {
        userId
      })
      .where("userUnit.deleted = false")
      .getMany();
  }

  static async patchUnit(id: string, data: IPatchedUnitData): Promise<Unit> {
    const manager = getManager();
    const repository = getRepository(Unit);
    const unit: Unit = await repository.findOne({
      where: {
        id,
        deleted: false
      }
    });
    unit.number = data.number || unit.number;
    unit.section = data.section || unit.section;
    unit.reference = data.reference || unit.reference;
    unit.updatedAt = new Date();

    if (!unit) {
      throw new Error(`Unit ${id} doesn't exists`);
    }

    if (
      (data.number && data.number !== unit.number) ||
      (data.section && data.section !== unit.section)
    ) {
      const unitExists: Unit = await getRepository(Unit).findOne({
        where: {
          number: unit.number,
          section: unit.section,
          deleted: false
        }
      });

      if (unitExists) {
        throw new Error(`Unit ${unit.number}${unit.section} already exists`);
      }
    }

    return manager.save(unit);
  }

  static async addUser(
    unitId: string,
    userId: string,
    isOwner: boolean
  ): Promise<Unit> {
    const manager = getManager();
    const repository = getRepository(UserUnit);
    const unit = await UnitService.getById(unitId);

    if (!unit) {
      throw new Error(`Unit ${unitId} doesn't exists`);
    }

    const user = await UserService.getById(userId);

    if (!user) {
      throw new Error(`User ${userId} doesn't exists`);
    }

    const userUnit = await repository.findOne({
      where: {
        unit: unitId,
        user: userId,
        deleted: false
      }
    });

    if (userUnit) {
      throw new Error(`User ${userId} already register with unit ${unitId}`);
    }

    const newUserUnit = new UserUnit();
    newUserUnit.unit = unit;
    newUserUnit.user = user;
    newUserUnit.isOwner = isOwner;

    await manager.save(newUserUnit);

    return unit;
  }

  static async addUserWithCode(userId: string, code: string): Promise<Unit> {
    const unit = await UnitService.getByCode(code);

    if (!unit) {
      throw new Error(`Unit with code ${code} doesn't exists`);
    }

    return UnitService.addUser(unit.id, userId, unit.ownerCode === code);
  }

  static async deleteUnit(id: string): Promise<Unit> {
    const repository = getRepository(Unit);
    const unit: Unit = await repository.findOne({
      where: {
        id,
        deleted: false
      }
    });
    if (unit) {
      unit.deleted = true;
      unit.deletedAt = new Date();
      return repository.save(unit);
    }
    return unit;
  }

  static async removeUser(userUnitId: string): Promise<Unit> {
    const repository = getRepository(UserUnit);
    const userUnit = await repository.findOne({
      where: {
        id: userUnitId
      },
      relations: ["unit"]
    });

    userUnit.deleted = true;
    userUnit.deletedAt = new Date();

    await repository.save(userUnit);

    return UnitService.getUnitAndUsersById(userUnit.unit.id);
  }

  static async changeUserPermission(
    id: string,
    makeAdmin: boolean
  ): Promise<Unit> {
    const manager = getManager();
    const repository = getRepository(UserUnit);
    const userUnit = await repository.findOne({
      where: {
        id,
        deleted: false
      },
      relations: ["unit"]
    });

    userUnit.isOwner = makeAdmin;
    await manager.save(userUnit);
    return UnitService.getUnitAndUsersById(userUnit.unit.id);
  }
}
