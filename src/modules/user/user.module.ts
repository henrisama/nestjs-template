import { User } from "./user.entity";
import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { AutoModule } from "../auto/auto.module";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";

@Module(
  AutoModule.forFeature<User>({
    schema: User,
    service: UserService,
    createDto: CreateUserDto,
    updateDto: UpdateUserDto,
  }),
)
export class UserModule {}
