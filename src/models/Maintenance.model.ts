import { Column, Entity, ManyToOne } from "typeorm";
import { Unit } from "./Unit.model";
import { ServiceBase } from "./BaseEntities/ServiceBase";

@Entity()
export class Maintenance extends ServiceBase {
  @ManyToOne(type => Unit, unit => unit.maintenance)
  unit!: Unit;
}
