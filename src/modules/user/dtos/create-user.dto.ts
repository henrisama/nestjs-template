import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Validate } from "class-validator";
import { IName, IUser } from "src/interfaces/user.interface";
import { PasswordValidator } from "src/validators/password.validate";

class CreateUserNameDto implements IName {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  first: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  last: string;
}

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
  name: CreateUserNameDto;
}
