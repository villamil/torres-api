import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne
} from "typeorm";

import { BaseEntity } from "./EntityBase";
import { Unit } from "../Unit.model";

export abstract class ServiceBase extends BaseEntity {
  @Column()
  month!: number;

  @Column()
  year!: number;

  @Column()
  dueAmount!: number;

  @Column({ default: 0 })
  paidAmount!: number;

  @Column()
  paid!: boolean;

  @Column({ default: null })
  paidDate!: Date;
}
