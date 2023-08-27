import { TypeOrmModuleOptions } from "@nestjs/typeorm";

type SupportedDatabases = "mysql" | "postgres";

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  type: process.env.TYPEORM_TYPE as SupportedDatabases,
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT, 10),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: ["dist/modules/**/*.entity.js"],
  migrations: ["dist/infra/db/typeorm/migrations/**/*.js"],
  migrationsRun: true,
  logging: true,
  logger: "file",
};
