import { User } from "./user.entity";
import { Module } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { DatabaseAdapter, EntityModule } from "../auto/auto.module";

@Module({
  imports: [
    EntityModule.forFeature<User>({
      schema: User,
      adapter: DatabaseAdapter.TYPEORM,
      createDto: CreateUserDto,
      updateDto: UpdateUserDto,
    }),
  ],
})
export class UserModule {}
