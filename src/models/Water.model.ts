import { Column, Entity, ManyToOne } from "typeorm";
import { ServiceBase } from "./BaseEntities/ServiceBase";
import { Unit } from "./Unit.model";

@Entity()
export class Water extends ServiceBase {
  @Column({ default: 0 })
  previuslyMesured!: number;

  @Column({ default: 0 })
  currentMesured!: number;

  @ManyToOne(
    type => Unit,
    unit => unit.water
  )
  unit!: Unit;
}
