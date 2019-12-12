import * as path from "path";
import moment from "moment";

import { UnitService } from "./unit.service";
import { MaintenanceService } from "./maintenance.service";
import { WaterService } from "./water.service";

import readXlsxFile from "read-excel-file/node";

function parse(value) {
  const parsedValue = Number(value);
  if (isNaN(parsedValue)) {
    throw new Error("Invalid number");
  }
  return parsedValue;
}

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
              section: section.type,
              ownerCode: row.code
            });
            if (unit.id) {
              const currentMonth = Number(moment().format("MM"));
              for (let month = 1; month <= currentMonth; month++) {
                if (month === 1) {
                  await MaintenanceService.createMaintenance({
                    month,
                    year,
                    dueAmount:
                      Math.sign(row.previousYearOwed) === -1
                        ? section.maintenanceBaseAmount +
                          Math.abs(row.previousYearOwed)
                        : section.maintenanceBaseAmount,
                    paidAmount:
                      Math.sign(row.previousYearOwed) === 1
                        ? (row[month] || 0) + row.previousYearOwed
                        : row[month] || 0,
                    paid: row[month] >= section.maintenanceBaseAmount,
                    unitId: unit.id
                  });
                } else if (month === 12) {
                  await MaintenanceService.createMaintenance({
                    month,
                    year,
                    dueAmount: section.maintenanceBaseAmount + 840,
                    paidAmount: row.extraAmount
                      ? (row[month] || 0) + row.extraAmount
                      : row[month] || 0,
                    paid: row[month] >= section.maintenanceBaseAmount,
                    unitId: unit.id
                  });
                } else {
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
        console.log(water.rows);
        for (const row of water.rows) {
          if (!isNaN(row.number)) {
            const unit = await UnitService.createUnit({
              ...row,
              section: section.type,
              ownerCode: row.code
            });
            if (unit.id) {
              let previouslyOwed = 0;
              if (row["2018"]) {
                const due = row["2018"].dueAmountOne + row["2018"].dueAmountTwo;
                const paid = row["2018"].paidAmount || 0;
                previouslyOwed = due - paid;
              }
              const currentMonth = Number(moment().format("MM"));
              for (let month = 1; month <= currentMonth; month++) {
                if (month === 1) {
                  const { paidAmount = 0, dueAmount = 0 } = row[month] || {};
                  await WaterService.createWater({
                    month,
                    year,
                    dueAmount: previouslyOwed + dueAmount,
                    paidAmount:
                      (paidAmount || 0) + (row[month + 1].paidAmount || 0),
                    paid: paidAmount + dueAmount >= previouslyOwed,
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
    CODIGO: {
      prop: "code",
      type: String
    },
    "Saldo MTTal 1 ENE 2019": {
      prop: "previousYearOwed",
      type: String
    },
    "2019ENERO": {
      prop: "1",
      type: String
    },
    "2019FEBRERO": {
      prop: "2",
      type: String
    },
    "2019MARZO": {
      prop: "3",
      type: String
    },
    "2019ABRIL": {
      prop: "4",
      type: String
    },
    "2019MAYO": {
      prop: "5",
      type: String
    },
    "2019JUNIO": {
      prop: "6",
      type: String
    },
    "2019JULIO": {
      prop: "7",
      type: String
    },
    "2019AGOSTO": {
      prop: "8",
      type: String
    },
    "2019SEPT": {
      prop: "9",
      type: String
    },
    "2019OCTUBRE": {
      prop: "10",
      type: String
    },
    "2019NOV.": {
      prop: "11",
      type: String
    },
    "2019DIC.": {
      prop: "12",
      type: String
    },
    "CUOTA EXT 2019": {
      prop: "extraAmount",
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
          type: Number,
          parse
        },
        ENE2019Consumo: {
          prop: "dueAmount",
          type: Number,
          parse
        }
      }
    },
    "2": {
      prop: 2,
      type: {
        FEB2019Pagos: {
          prop: "paidAmount",
          type: Number,
          parse
        },
        FEB2019Consumo: {
          prop: "dueAmount",
          type: Number,
          parse
        }
      }
    },
    "3": {
      prop: 3,
      type: {
        MAR2019Pagos: {
          prop: "paidAmount",
          type: Number,
          parse
        },
        MAR2019Consumo: {
          prop: "dueAmount",
          type: Number,
          parse
        }
      }
    },
    "4": {
      prop: 4,
      type: {
        ABR2019Pagos: {
          prop: "paidAmount",
          type: Number,
          parse
        },
        ABR2019Consumo: {
          prop: "dueAmount",
          type: Number,
          parse
        }
      }
    },
    "5": {
      prop: 5,
      type: {
        MAY2019Pagos: {
          prop: "paidAmount",
          type: Number,
          parse
        },
        MAY2019Consumo: {
          prop: "dueAmount",
          type: Number,
          parse
        }
      }
    },
    "6": {
      prop: 6,
      type: {
        JUN2019Pagos: {
          prop: "paidAmount",
          type: Number,
          parse
        },
        JUN2019Consumo: {
          prop: "dueAmount",
          type: Number,
          parse
        }
      }
    },
    "7": {
      prop: 7,
      type: {
        JUL2019Pagos: {
          prop: "paidAmount",
          type: Number,
          parse
        },
        JUL2019Consumo: {
          prop: "dueAmount",
          type: Number,
          parse
        }
      }
    },
    "8": {
      prop: 8,
      type: {
        AGO2019Pagos: {
          prop: "paidAmount",
          type: Number,
          parse
        },
        AGO2019Consumo: {
          prop: "dueAmount",
          type: Number,
          parse
        }
      }
    },
    "9": {
      prop: 9,
      type: {
        SEPT2019Pagos: {
          prop: "paidAmount",
          type: Number,
          parse
        },
        SEPT2019Consumo: {
          prop: "dueAmount",
          type: Number,
          parse
        }
      }
    },
    "10": {
      prop: 10,
      type: {
        OCT2019Pagos: {
          prop: "paidAmount",
          type: Number,
          parse
        },
        OCT2019Consumo: {
          prop: "dueAmount",
          type: Number,
          parse
        }
      }
    },
    "11": {
      prop: 11,
      type: {
        "NOV.2019Pagos": {
          prop: "paidAmount",
          type: Number,
          parse
        },
        "NOV.2019Consumo": {
          prop: "dueAmount",
          type: Number,
          parse
        }
      }
    },
    "12": {
      prop: 12,
      type: {
        DIC2019Pagos: {
          prop: "paidAmount",
          type: Number,
          parse
        },
        DIC2019Consumo: {
          prop: "dueAmount",
          type: Number,
          parse
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
    data[0] = data[0].map(item =>
      item
        ? item
            .split("\n")
            .map(word => word.trim())
            .join("")
            .split("\r")
            .map(word => word.trim())
            .join("")
        : null
    );
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
            .split("\r")
            .map(word => word.trim())
            .join("")
        : null
    );
    return data;
  }
}
