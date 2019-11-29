import { getManager, getRepository, In } from "typeorm";

import { Maintenance } from "../models/Maintenance.model";
import { Unit } from "../models/Unit.model";
import { UnitService } from "./unit.service";

interface ICreateMaintenanceData {
  month: number;
  year: number;
  paidDate?: Date;
  paidAmount?: number;
  dueAmount: number;
  paid: boolean;
  unitId: string;
}

interface IPatchedMaintenanceData {
  month?: number;
  year?: number;
  paidDate?: Date;
  dueAmount?: number;
  paid?: boolean;
  unitId?: string;
}

export class MaintenanceService {
  static async createMaintenance(
    data: ICreateMaintenanceData
  ): Promise<Maintenance> {
    const manager = getManager();
    const maintenance = new Maintenance();
    maintenance.month = data.month;
    maintenance.year = data.year;
    maintenance.paidDate = data.paidDate;
    maintenance.dueAmount = data.dueAmount;
    maintenance.paid = data.paid;
    maintenance.paidAmount = data.paidAmount;

    const unit: Unit = await UnitService.getById(data.unitId);

    if (!unit) {
      throw new Error(`Unit ${data.unitId} doesn't exist.`);
    }

    maintenance.unit = unit;

    const maintenanceByDate: Maintenance = await getRepository(
      Maintenance
    ).findOne({
      where: {
        month: data.month,
        year: data.year,
        unit: data.unitId,
        deleted: false
      }
    });

    if (maintenanceByDate) {
      maintenanceByDate.paid = data.paid;
      maintenanceByDate.paidAmount = data.paidAmount;
      return manager.save(maintenanceByDate);
    }

    return manager.save(maintenance);
  }

  static getAll(): Promise<Maintenance[]> {
    return getRepository(Maintenance).find({
      where: {
        deleted: false
      },
      relations: ["unit"]
    });
  }

  static getById(id: string): Promise<Maintenance> {
    return getRepository(Maintenance).findOne({
      where: {
        id,
        deleted: false
      },
      relations: ["unit"]
    });
  }

  static async patchMaintenance(
    id: string,
    data: IPatchedMaintenanceData
  ): Promise<Maintenance> {
    const manager = getManager();
    const repository = getRepository(Maintenance);
    const maintenance: Maintenance = await repository.findOne({
      where: {
        id,
        deleted: false
      }
    });

    if (!maintenance) {
      throw new Error(`maintenance ${id} doesn't exists`);
    }

    maintenance.month = data.month;
    maintenance.year = data.year;
    maintenance.paidDate = data.paidDate;
    maintenance.dueAmount = data.dueAmount;
    maintenance.paid = data.paid;

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

      maintenance.unit = unit;
    }

    return manager.save(maintenance);
  }

  static async deleteMaintenance(id: string): Promise<Maintenance> {
    const repository = getRepository(Maintenance);
    const maintenance: Maintenance = await repository.findOne({
      where: {
        id,
        deleted: false
      }
    });
    if (maintenance) {
      maintenance.deleted = true;
      maintenance.deletedAt = new Date();
      return repository.save(maintenance);
    }
    return maintenance;
  }

  static async findByIdRange(ids: string[]): Promise<Maintenance[]> {
    return getRepository(Maintenance).find({
      id: In(ids)
    });
  }

  static async totalOwed(unitId: string): Promise<number> {
    const maintenance = await getRepository(Maintenance).find({
      where: {
        unit: unitId,
        deleted: false
      }
    });

    const totalDueAndPaidAmount = maintenance.reduce(
      (acum, current) => {
        acum.due += current.dueAmount;
        acum.paid += current.paidAmount;
        return acum;
      },
      { due: 0, paid: 0 }
    );

    return totalDueAndPaidAmount.paid - totalDueAndPaidAmount.due;
  }

  static async getByUnit(unitId: string): Promise<Maintenance[]> {
    return getRepository(Maintenance).find({
      where: {
        unit: unitId,
        deleted: false
      },
      order: {
        month: "ASC"
      }
    });
  }
}
