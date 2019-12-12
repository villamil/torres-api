import * as path from "path";
import moment from "moment";

import { UnitService } from "./unit.service";
import { MaintenanceService } from "./maintenance.service";
import { WaterService } from "./water.service";

import readXlsxFile from "read-excel-file/node";

export class WorkerService {
  static async readFile(buffer, year) {
    for (const section of WorkerService.sections) {
      const resultMaintenance = await readXlsxFile(buffer, {
        sheet: section.maintenanceSheet,
        schema: section.maintenanceSchema,
        transformData: section.maintenanceFormatData
      });
      await this.updateMaintenance(resultMaintenance, section, year);
      const resultWater = await readXlsxFile(buffer, {
        sheet: section.waterSheet,
        schema: section.waterSchema,
        transformData: section.waterTransformData
      });
      if (section.type === "B") {
        // console.log(resultWater);
      }
      await this.updateWater(resultWater, section, year);
    }
  }

  static async updateMaintenance(maintenance, section, year) {
    return new Promise(async (resolve, reject) => {
      try {
        for (const row of maintenance.rows) {
          if (!isNaN(row.number)) {
            const unit = await UnitService.createUnit({
              ...row,
              section: section.type
            });
            if (unit.id) {
              const currentMonth = Number(moment().format("MM"));
              for (let month = 1; month <= currentMonth; month++) {
                await MaintenanceService.createMaintenance({
                  month,
                  year,
                  dueAmount: section.maintenanceBaseAmount,
                  paidAmount: row[month] || 0,
                  paid: row[month] >= section.maintenanceBaseAmount,
                  unitId: unit.id
                });
              }
            }
          }
        }
        resolve();
      } catch (error) {
        resolve();
        console.log("Error updating maintenance", error);
      }
    });
  }

  static async updateWater(water, section, year) {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log(water.rows);
        for (const row of water.rows) {
          if (!isNaN(row.number)) {
            const unit = await UnitService.createUnit({
              ...row,
              section: section.type
            });
            if (unit.id) {
              let previouslyOwed = 0;
              if (row["2018"]) {
                const due = row["2018"].dueAmountOne + row["2018"].dueAmountTwo;
                const paid = row["2018"].paidAmount || 0;
                previouslyOwed = due - paid;
              }
              const currentMonth = Number(moment().format("MM"));
              for (let month = 1; month <= currentMonth - 1; month++) {
                if (month === 1) {
                  const { paidAmount = 0, dueAmount = 0 } = row[month] || {};
                  await WaterService.createWater({
                    month,
                    year,
                    dueAmount: previouslyOwed + dueAmount,
                    paidAmount: paidAmount || 0,
                    paid: paidAmount >= previouslyOwed + dueAmount,
                    unitId: unit.id
                  });
                } else {
                  const { dueAmount = 0 } = row[month] || {};
                  const { paidAmount = 0 } = row[month + 1] || {};
                  await WaterService.createWater({
                    month,
                    year,
                    dueAmount,
                    paidAmount: paidAmount || 0,
                    paid: paidAmount >= dueAmount,
                    unitId: unit.id
                  });
                }
              }
            }
          }
        }
        resolve();
      } catch (error) {
        reject("Error updating maintenance");
        console.log("Error updating maintenance", error);
      }
    });
  }

  private static maintenanceSchema = {
    "Dpto.": {
      prop: "number",
      type: String
    },
    REFERENCIA: {
      prop: "reference",
      type: String
    },
    "2019 ENERO": {
      prop: "1",
      type: String
    },
    "2019 FEBRERO": {
      prop: "2",
      type: String
    },
    "2019 MARZO": {
      prop: "3",
      type: String
    },
    "2019 ABRIL": {
      prop: "4",
      type: String
    },
    "2019 MAYO": {
      prop: "5",
      type: String
    },
    "2019 JUNIO": {
      prop: "6",
      type: String
    },
    "2019 JULIO": {
      prop: "7",
      type: String
    },
    "2019 AGOSTO": {
      prop: "8",
      type: String
    },
    "2019 SEPT": {
      prop: "9",
      type: String
    },
    "2019 OCTUBRE": {
      prop: "10",
      type: String
    },
    "2019 NOV.": {
      prop: "11",
      type: String
    },
    "2019 DIC.": {
      prop: "12",
      type: String
    }
  };

  private static waterSchema = {
    "DEP.": {
      prop: "number",
      type: String
    },
    "REF.": {
      prop: "reference",
      type: String
    },
    "2018": {
      prop: 2018,
      type: {
        "Seo-Oct 2018 Consumo": {
          prop: "dueAmountOne",
          type: String
        },
        "Nov-Dic 2018 Consumo": {
          prop: "dueAmountTwo",
          type: String
        },
        "DIC2018 Pagos": {
          prop: "paidAmount",
          type: String
        }
      }
    },
    "1": {
      prop: 1,
      type: {
        ENE2019Pagos: {
          prop: "paidAmount",
          type: String
        },
        ENE2019Consumo: {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "2": {
      prop: 2,
      type: {
        FEB2019Pagos: {
          prop: "paidAmount",
          type: String
        },
        FEB2019Consumo: {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "3": {
      prop: 3,
      type: {
        MAR2019Pagos: {
          prop: "paidAmount",
          type: String
        },
        MAR2019Consumo: {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "4": {
      prop: 4,
      type: {
        ABR2019Pagos: {
          prop: "paidAmount",
          type: String
        },
        ABR2019Consumo: {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "5": {
      prop: 5,
      type: {
        MAY2019Pagos: {
          prop: "paidAmount",
          type: String
        },
        MAY2019Consumo: {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "6": {
      prop: 6,
      type: {
        JUN2019Pagos: {
          prop: "paidAmount",
          type: String
        },
        JUN2019Consumo: {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "7": {
      prop: 7,
      type: {
        JUL2019Pagos: {
          prop: "paidAmount",
          type: String
        },
        JUL2019Consumo: {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "8": {
      prop: 8,
      type: {
        AGO2019Pagos: {
          prop: "paidAmount",
          type: String
        },
        AGO2019Consumo: {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "9": {
      prop: 9,
      type: {
        SEPT2019Pagos: {
          prop: "paidAmount",
          type: String
        },
        SEPT2019Consumo: {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "10": {
      prop: 10,
      type: {
        OCT2019Pagos: {
          prop: "paidAmount",
          type: String
        },
        OCT2019Consumo: {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "11": {
      prop: 11,
      type: {
        "NOV.2019Pagos": {
          prop: "paidAmount",
          type: String
        },
        "NOV.2019Consumo": {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "12": {
      prop: 12,
      type: {
        DIC2019Pagos: {
          prop: "paidAmount",
          type: String
        },
        DIC2019Consumo: {
          prop: "dueAmount",
          type: String
        }
      }
    }
  };

  private static sections = [
    {
      type: "A",
      maintenanceSheet: "MANT TORRE A",
      maintenanceSchema: WorkerService.maintenanceSchema,
      maintenanceFormatData: WorkerService.maintenanceFormatData,
      waterSheet: "AGUA TORRE A",
      waterSchema: WorkerService.waterSchema,
      waterTransformData: WorkerService.waterTransformData,
      maintenanceBaseAmount: 700,
      year: 2019
    },
    {
      type: "B",
      maintenanceSheet: "MANT TORRE B",
      maintenanceSchema: WorkerService.maintenanceSchema,
      maintenanceFormatData: WorkerService.maintenanceFormatData,
      waterSheet: "AGUA TORRE B",
      waterSchema: WorkerService.waterSchema,
      waterTransformData: WorkerService.waterTransformData,
      maintenanceBaseAmount: 700,
      year: 2019
    }
  ];

  private static maintenanceFormatData(data) {
    data.shift();
    data[0] = data[0].map(item => (item ? item.split("\n").join("") : null));
    console.log(data);
    return data;
  }

  private static waterTransformData(data) {
    data.shift();
    data.shift();
    data[0] = data[0].map(item =>
      item
        ? item
            .split("\n")
            .map(word => word.trim())
            .join("")
        : null
    );
    return data;
  }
}
