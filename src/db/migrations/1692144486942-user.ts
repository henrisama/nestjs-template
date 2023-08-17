import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { withSoftDelete, withTimestamps } from "../helper.db";

export class User1692144486942 implements MigrationInterface {
  private table = new Table({
    name: "User",
    columns: [
      {
        name: "id",
        type: "varchar",
        length: "26",
        isPrimary: true,
      },
      {
        name: "nameFirst",
        type: "varchar",
        length: "30",
      },
      {
        name: "nameLast",
        type: "varchar",
        length: "30",
      },
      {
        name: "email",
        type: "varchar",
        length: "256",
        isUnique: true,
      },
      {
        name: "password",
        type: "varchar",
        length: "256",
      },
      ...withTimestamps(),
      ...withSoftDelete(),
    ],
  });
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
