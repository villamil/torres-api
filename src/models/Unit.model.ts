import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  ManyToMany,
  ManyToOne,
  JoinTable
} from "typeorm";
import * as randomString from "randomstring";

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

  @Column({
    unique: true,
    default: () =>
      `"${randomString.generate({
        length: 7,
        charset: "alphanumeric"
      })}"`
  })
  signUpCode!: string;

  @ManyToOne(type => User, user => user.unit, { cascade: true })
  @JoinColumn()
  owner!: User;

  @OneToMany(type => Maintenance, maintenance => maintenance.unit)
  maintenance!: Maintenance[];

  @OneToMany(type => Water, water => water.unit)
  water!: Water[];

  @ManyToMany(type => User)
  @JoinTable()
  tenants!: User[];
}
