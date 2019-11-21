import { getManager, getRepository, getConnection } from "typeorm";

import { Unit } from "../models/Unit.model";
import { User } from "../models/User.model";
import { Maintenance } from "../models/Maintenance.model";

import { UserService } from "../services/user.service";

interface ICreateUnitData {
  number: number;
  section: string;
  reference: number;
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
    unit.tenants = [];

    const unitExists: Unit = await getRepository(Unit).findOne({
      where: {
        number: data.number,
        section: data.section,
        deleted: false
      }
    });

    if (unitExists) {
      throw new Error(`Unit ${data.number}${data.section} already exists`);
    }

    if (data.owner) {
      const owner: User = await UserService.getById(data.owner);
      if (owner) {
        unit.owners.push(owner);
      }
    }

    if (data.tenants) {
      const tenants: User[] = await UserService.findByIdRange(data.tenants);
      unit.tenants = tenants;
    }

    return manager.save(unit);
  }

  static getAll(): Promise<Unit[]> {
    return getRepository(Unit).find({
      where: {
        deleted: false
      },
      relations: ["tenants", "owners", "maintenance", "water"]
    });
  }

  static getById(id: string): Promise<Unit> {
    return getRepository(Unit).findOne({
      where: {
        id,
        deleted: false
      },
      relations: ["tenants", "owners", "maintenance", "water"]
    });
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

  static getByTenant(userId: string): Promise<Unit[]> {
    return getRepository(Unit)
      .createQueryBuilder("unit")
      .innerJoinAndSelect("unit.tenants", "tenant", "tenant.id = :tenantId", {
        tenantId: userId
      })
      .leftJoinAndSelect("unit.maintenance", "maintenance")
      .getMany();
  }

  static getByOwner(userId: string): Promise<Unit[]> {
    return getRepository(Unit)
      .createQueryBuilder("unit")
      .innerJoinAndSelect("unit.owners", "owner", "owner.id = :ownerId", {
        ownerId: userId
      })
      .leftJoinAndSelect("unit.maintenance", "maintenance")
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
    unit.tenants = [];

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

    if (data.owner) {
      const owner: User = await UserService.getById(data.owner);
      if (owner) {
        unit.owners.push(owner);
      }
    } else {
      await getRepository(Unit).update({ id: unit.id }, { owners: null });
    }

    if (data.tenants) {
      const tenants: User[] = await UserService.findByIdRange(data.tenants);
      unit.tenants = tenants;
    }

    return manager.save(unit);
  }

  static async addTenant(unitId: string, userId: string): Promise<Unit> {
    const manager = getManager();
    const unit = await UnitService.getById(unitId);

    if (!unit) {
      throw new Error(`Unit ${unitId} doesn't exists`);
    }

    const user = await UserService.getById(userId);

    if (!user) {
      throw new Error(`User ${userId} doesn't exists`);
    }

    unit.tenants.push(user);

    return manager.save(unit);
  }

  static async addOwner(unitId: string, userId: string): Promise<Unit> {
    const manager = getManager();
    const unit = await UnitService.getById(unitId);

    if (!unit) {
      throw new Error(`Unit ${unitId} doesn't exists`);
    }

    const user = await UserService.getById(userId);

    if (!user) {
      throw new Error(`User ${userId} doesn't exists`);
    }

    unit.owners.push(user);

    return manager.save(unit);
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
}
