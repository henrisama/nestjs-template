import { User } from "./user.entity";
import { Module } from "@nestjs/common";
import { generateModule } from "../crud/crud.module";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";

@Module({
  imports: [generateModule<User>(User, CreateUserDto, UpdateUserDto)],
})
export class UserModule {}
