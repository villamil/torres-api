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
