import { getConnection, getRepository } from "typeorm";

import { Unit } from "../models/Unit.model";
import { User } from "../models/User.model";

import { UserService } from "../services/user.service";
import { UnitService } from "../services/unit.service";
import { MaintenanceService } from "../services/maintenance.service";
import { WaterService } from "../services/water.service";

export class TestData {
  static async createData() {
    await TestData.clearOldData();
    const createdUnits: Unit[] = await TestData.createUnits();
    const createdUsers: User[] = await TestData.createUsers(createdUnits);
    await TestData.createWater(createdUnits);
    await TestData.createMaintenance(createdUnits);
  }

  static async createUnits(): Promise<Unit[]> {
    const units = [
      {
        number: 101,
        section: "A",
        reference: 10116
      },
      {
        number: 102,
        section: "A",
        reference: 10117
      }
    ];
    const createdUnits = [];
    for (const unit of units) {
      const createdUnit = await UnitService.createUnit(unit);
      createdUnits.push(createdUnit);
    }
    return createdUnits;
  }

  static async createUsers(units: Unit[]): Promise<User[]> {
    const firstUnit = units[0];
    const secondUnit = units[1];

    const users = [
      {
        firstName: "Owner",
        lastName: "Doe",
        email: "villamil_one@hotmail.com",
        password: "1234",
        code: firstUnit.ownerCode
      },
      {
        firstName: "Tenant",
        lastName: "Doe",
        email: "villamil_two@hotmail.com",
        password: "1234",
        code: firstUnit.signUpCode
      }
    ];
    const createdUsers = [];
    for (const user of users) {
      const createdUser = await UserService.createUser(user);
      createdUsers.push(createdUser);
    }
    return createdUsers;
  }

  static async createMaintenance(units: Unit[]): Promise<void> {
    const multipleMaintenance = [];
    for (const unit of units) {
      for (let x = 1; x <= 12; x++) {
        const isPaid = Math.random() >= 0.5;
        multipleMaintenance.push({
          month: x,
          year: 2019,
          dueAmount: 700,
          paid: isPaid,
          unitId: unit.id,
          paidDate: isPaid ? new Date() : null
        });
      }
    }

    for (const maintenance of multipleMaintenance) {
      await MaintenanceService.createMaintenance(maintenance);
    }
  }

  static async createWater(units: Unit[]): Promise<void> {
    const multipleWater = [];
    for (const unit of units) {
      for (let x = 1; x <= 12; x++) {
        const isPaid = Math.random() >= 0.5;
        multipleWater.push({
          month: x,
          year: 2019,
          dueAmount: TestData.randomInt(60, 200),
          paid: isPaid,
          unitId: unit.id,
          paidDate: isPaid ? new Date() : null,
          previuslyMesured: TestData.randomInt(200, 400),
          currentMesured: TestData.randomInt(200, 400)
        });
      }
    }

    for (const water of multipleWater) {
      await WaterService.createWater(water);
    }
  }

  static async clearOldData() {
    const entities = await TestData.getEntities();
    await TestData.cleanAll(entities);
  }

  static async getEntities() {
    const entities = [];
    const connection = await getConnection();
    connection.entityMetadatas.forEach(x =>
      entities.push({ name: x.name, tableName: x.tableName })
    );
    return entities;
  }

  static async cleanAll(entities) {
    try {
      for (const entity of entities) {
        await getRepository(entity.name).query(`SET FOREIGN_KEY_CHECKS = 0;`);
        await getRepository(entity.name).query(
          `TRUNCATE TABLE \`${entity.tableName}\`;`
        );
        await getRepository(entity.name).query(`SET FOREIGN_KEY_CHECKS = 1;`);
      }
    } catch (error) {
      throw new Error(`ERROR: Cleaning test db: ${error}`);
    }
  }

  private static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}