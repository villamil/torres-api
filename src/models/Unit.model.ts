import {
  Column,
  Entity,
  Generated,
  OneToMany,
  OneToOne,
  ManyToMany,
  ManyToOne,
  JoinTable
} from "typeorm";

import { v4 as uuid } from "uuid";

import { BaseEntity } from "./BaseEntities/EntityBase";
import { User } from "./User.model";
import { Maintenance } from "./Maintenance.model";
import { Water } from "./Water.model";
import { UserUnit } from "./UserUnit.model";

@Entity()
export class Unit extends BaseEntity {
  @Column()
  number!: number;

  @Column()
  section!: string;

  @Column()
  reference!: number;

  @Column({ unique: true })
  @Generated("uuid")
  signUpCode!: string;

  @Column({ unique: true })
  @Generated("uuid")
  ownerCode!: string;

  @OneToMany(
    type => Maintenance,
    maintenance => maintenance.unit
  )
  maintenance!: Maintenance[];

  @OneToMany(
    type => Water,
    water => water.unit
  )
  water!: Water[];

  @OneToMany(
    type => UserUnit,
    userUnit => userUnit.unit
  )
  userUnit!: UserUnit[];
}
