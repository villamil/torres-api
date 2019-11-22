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

  @ManyToMany(type => User)
  @JoinTable()
  owners!: User[];

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

  @ManyToMany(type => User)
  @JoinTable()
  tenants!: User[];
}
