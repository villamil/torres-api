import { Column, Entity, ManyToOne, ManyToMany, OneToMany } from "typeorm";
import { User } from "./User.model";
import { Unit } from "./Unit.model";
import { BaseEntity } from "./BaseEntities/EntityBase";

@Entity()
export class UserUnit extends BaseEntity {
  @Column()
  isOwner!: boolean;

  @ManyToOne(
    type => User,
    user => user.userUnit
  )
  user!: User;

  @ManyToOne(
    type => Unit,
    unit => unit.userUnit
  )
  unit!: Unit;
}
