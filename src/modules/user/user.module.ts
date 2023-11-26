import { User } from "./user.entity";
import { Module } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { EntityModule } from "../auto/auto.module";
import { UserService } from "./user.service";

@Module({
  imports: [
    EntityModule.forFeature<User>({
      schema: User,
      service: UserService,
      createDto: CreateUserDto,
      updateDto: UpdateUserDto,
    }),
  ],
})
export class UserModule {}
