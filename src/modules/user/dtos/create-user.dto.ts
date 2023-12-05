import { IUser } from "../user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { PasswordValidator } from "src/validators/password.validate";
import { IsEmail, IsNotEmpty, IsString, Validate } from "class-validator";

export class CreateUserDto implements IUser {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Validate(PasswordValidator)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
