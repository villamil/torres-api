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
        unit.owner = owner;
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
      relations: ["tenants", "owner", "maintenance", "water"]
    });
  }

  static getById(id: string): Promise<Unit> {
    return getRepository(Unit).findOne({
      where: {
        id,
        deleted: false
      },
      relations: ["tenants", "owner", "maintenance", "water"]
    });
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
        unit.owner = owner;
      }
    } else {
      await getRepository(Unit).update({ id: unit.id }, { owner: null });
    }

    if (data.tenants) {
      const tenants: User[] = await UserService.findByIdRange(data.tenants);
      unit.tenants = tenants;
    }

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
