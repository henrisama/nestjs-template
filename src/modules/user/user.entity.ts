import { ulid } from "ulid";
import { Entity, Column, PrimaryColumn } from "typeorm";
import { BaseSchema } from "src/infra/db/typeorm/base.schema";

export interface IUser {
  name: string;
  email: string;
  password: string;
}

@Entity({ name: "User" })
export class User extends BaseSchema implements IUser {
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
