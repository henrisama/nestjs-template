import { ulid } from "ulid";
import { BaseEntity } from "src/infra/db/typeorm/base.entity";
import { Entity, Column, PrimaryColumn } from "typeorm";

export interface IUser {
  name: string;
  email: string;
  password: string;
}

@Entity({ name: "User" })
export class User extends BaseEntity implements IUser {
  constructor(user?: any) {
    super();
    Object.assign(this, user);
  }

  @PrimaryColumn("varchar", { length: 26 })
  id: string = ulid();

  @Column("varchar", { length: 256 })
  email: string;

  @Column("varchar", { length: 256 })
  password: string;

  @Column("varchar", { length: 256 })
  name: string;
}
