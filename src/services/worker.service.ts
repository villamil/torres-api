import * as path from "path";
import moment from "moment";

import { UnitService } from "./unit.service";
import { MaintenanceService } from "./maintenance.service";
import { WaterService } from "./water.service";

import readXlsxFile from "read-excel-file/node";

export class WorkerService {
  static async readFile(buffer) {
    for (const section of WorkerService.sections) {
      const resultMaintenance = await readXlsxFile(buffer, {
        sheet: section.maintenanceSheet,
        schema: section.maintenanceSchema,
        transformData: section.maintenanceFormatData
      });
      console.log(resultMaintenance);
      await this.updateMaintenance(resultMaintenance, section);
      const resultWater = await readXlsxFile(buffer, {
        sheet: section.waterSheet,
        schema: section.waterSchema,
        transformData: section.waterTransformData
      });
      await this.updateWater(resultWater, section);
    }
  }

  static async updateMaintenance(maintenance, section) {
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
                  year: section.year,
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

  static async updateWater(water, section) {
    return new Promise(async (resolve, reject) => {
      try {
        for (const row of water.rows) {
          if (!isNaN(row.number)) {
            const unit = await UnitService.createUnit({
              ...row,
              section: section.type
            });
            if (unit.id) {
              const currentMonth = Number(moment().format("MM"));
              for (let month = 1; month <= currentMonth; month++) {
                const { dueAmount, paidAmount } = row[month] || {};
                await WaterService.createWater({
                  month,
                  year: section.year,
                  dueAmount,
                  paidAmount: paidAmount || 0,
                  paid: paidAmount >= dueAmount,
                  unitId: unit.id
                });
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
    "1": {
      prop: 1,
      type: {
        "ENE2019 Pagos": {
          prop: "paidAmount",
          type: String
        },
        "ENE2019 Consumo": {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "2": {
      prop: 2,
      type: {
        "FEB2019 Pagos": {
          prop: "paidAmount",
          type: String
        },
        "FEB 2019 Consumo": {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "3": {
      prop: 3,
      type: {
        "MAR2019 Pagos": {
          prop: "paidAmount",
          type: String
        },
        "MAR2019 Consumo": {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "4": {
      prop: 4,
      type: {
        "ABR2019 Pagos": {
          prop: "paidAmount",
          type: String
        },
        "ABR 2019 Consumo": {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "5": {
      prop: 5,
      type: {
        "MAY 2019 Pagos": {
          prop: "paidAmount",
          type: String
        },
        "MAY 2019 Consumo": {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "6": {
      prop: 6,
      type: {
        "JUN 2019 Pagos": {
          prop: "paidAmount",
          type: String
        },
        "JUN 2019 Consumo": {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "7": {
      prop: 7,
      type: {
        "JUL 2019 Pagos": {
          prop: "paidAmount",
          type: String
        },
        "JUL 2019 Consumo": {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "8": {
      prop: 8,
      type: {
        "AGO 2019 Pagos": {
          prop: "paidAmount",
          type: String
        },
        "AGO 2019 Consumo": {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "9": {
      prop: 9,
      type: {
        "SEPT 2019 Pagos": {
          prop: "paidAmount",
          type: String
        },
        "SEPT 2019 Consumo": {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "10": {
      prop: 10,
      type: {
        "OCT 2019 Pagos": {
          prop: "paidAmount",
          type: String
        },
        "OCT 2019 Consumo": {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "11": {
      prop: 11,
      type: {
        "NOV. 2019 Pagos": {
          prop: "paidAmount",
          type: String
        },
        "NOV. 2019 Consumo": {
          prop: "dueAmount",
          type: String
        }
      }
    },
    "12": {
      prop: 12,
      type: {
        "DIC 2019 Pagos": {
          prop: "paidAmount",
          type: String
        },
        "DIC 2019 Consumo": {
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
    const replaceObj = {
      "\r\n": "",
      "\r\nPagos": "Pagos",
      "\r\nConsumo": "Consumo"
    };
    data[0] = data[0].map(item => (item ? item.split("\n").join("") : null));
    return data;
  }
}
