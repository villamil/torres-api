import { getManager, getRepository, In } from "typeorm";

import { Water } from "../models/Water.model";
import { Unit } from "../models/Unit.model";
import { UnitService } from "./unit.service";

interface ICreateWaterData {
  month: number;
  year: number;
  paidDate?: Date;
  dueAmount: number;
  paid: boolean;
  unitId: string;
  previuslyMesured: number;
  currentMesured: number;
}

interface IPatchedWaterData {
  month?: number;
  year?: number;
  paidDate?: Date;
  dueAmount?: number;
  paid?: boolean;
  unitId?: string;
  previuslyMesured?: number;
  currentMesured?: number;
}

export class WaterService {
  static async createWater(data: ICreateWaterData): Promise<Water> {
    const manager = getManager();
    const water = new Water();
    water.month = data.month;
    water.year = data.year;
    water.paidDate = data.paidDate;
    water.dueAmount = data.dueAmount;
    water.paid = data.paid;
    water.previuslyMesured = data.previuslyMesured;
    water.currentMesured = data.currentMesured;

    const unit: Unit = await UnitService.getById(data.unitId);

    if (!unit) {
      throw new Error(`Unit ${data.unitId} doesn't exist.`);
    }

    water.unit = unit;

    const waterByDate: Water = await getRepository(Water).findOne({
      where: {
        month: data.month,
        year: data.year,
        deleted: false
      }
    });

    if (waterByDate) {
      throw new Error(
        `Period already registered date: ${data.month} ${data.year}.`
      );
    }

    return manager.save(water);
  }

  static getAll(): Promise<Water[]> {
    return getRepository(Water).find({
      where: {
        deleted: false
      },
      relations: ["unit"]
    });
  }

  static getById(id: string): Promise<Water> {
    return getRepository(Water).findOne({
      where: {
        id,
        deleted: false
      },
      relations: ["unit"]
    });
  }

  static async patchWater(id: string, data: IPatchedWaterData): Promise<Water> {
    const manager = getManager();
    const repository = getRepository(Water);
    const water: Water = await repository.findOne({
      where: {
        id,
        deleted: false
      }
    });

    if (!water) {
      throw new Error(`Water ${id} doesn't exists`);
    }

    water.month = data.month;
    water.year = data.year;
    water.paidDate = data.paidDate;
    water.dueAmount = data.dueAmount;
    water.paid = data.paid;
    water.previuslyMesured = data.previuslyMesured;
    water.currentMesured = data.currentMesured;

    if (data.unitId) {
      const unit: Unit = await getRepository(Unit).findOne({
        where: {
          id: data.unitId,
          deleted: false
        }
      });

      if (!unit) {
        throw new Error(`Unit ${data.unitId} doesn't exist.`);
      }

      water.unit = unit;
    }

    return manager.save(water);
  }

  static async deleteWater(id: string): Promise<Water> {
    const repository = getRepository(Water);
    const water: Water = await repository.findOne({
      where: {
        id,
        deleted: false
      }
    });
    if (water) {
      water.deleted = true;
      water.deletedAt = new Date();
      return repository.save(water);
    }
    return water;
  }

  static async findByIdRange(ids: string[]): Promise<Water[]> {
    return getRepository(Water).find({
      id: In(ids)
    });
  }
}
