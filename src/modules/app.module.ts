import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmModuleOptions } from "src/db/source.db";
import { UserModule } from "./user/user.module";

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmModuleOptions), UserModule],
})
export class AppModule {}
