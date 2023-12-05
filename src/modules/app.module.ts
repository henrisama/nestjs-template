import "dotenv/config";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmModuleOptions } from "src/infra/db/typeorm/source.db";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
