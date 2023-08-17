import { ulid } from "ulid";
import * as bcrypt from "bcrypt";
import { BaseEntity } from "src/db/base.entity";
import { saltOrRounds } from "src/conf/api.conf";
import { Entity, Column, BeforeInsert, PrimaryColumn } from "typeorm";
import { IName, IUser } from "src/interfaces/user.interface";

export class Name implements IName {
  @Column("varchar", { length: 30 })
  first: string;

  @Column("varchar", { length: 30 })
  last: string;
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

  @Column(() => Name)
  name: Name;

  @BeforeInsert()
  async encryptPassword() {
    this.password = await bcrypt.hash(this.password, saltOrRounds);
  }
}
