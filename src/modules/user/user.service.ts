import * as bcrypt from "bcrypt";
import { User } from "./user.entity";
import { Injectable } from "@nestjs/common";
import { generateService } from "../auto/auto.service";
import { saltOrRounds } from "src/conf/api.conf";
import { IdType } from "src/infra/db/repository.port";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";

@Injectable()
export class UserService extends generateService(User) {
  async create(createDto: CreateUserDto) {
    createDto.password = await bcrypt.hash(createDto.password, saltOrRounds);
    return await this.repository.create(createDto);
  }

  async update(id: IdType, updateDto: UpdateUserDto): Promise<User> {
    if (updateDto.password) {
      updateDto.password = await bcrypt.hash(updateDto.password, saltOrRounds);
    }

    return await this.repository.update(id, updateDto);
  }
}
