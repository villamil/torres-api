import { Column, Entity, ManyToOne, ManyToMany, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntities/EntityBase";
import { Unit } from "./Unit.model";

@Entity()
export class User extends BaseEntity {
  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @OneToMany(type => Unit, unit => unit.owner)
  unit!: Unit[];
}
