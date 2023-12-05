import { ApiProperty } from "@nestjs/swagger";
import { PasswordValidator } from "src/validators/password.validate";
import { IsEmail, IsNotEmpty, IsString, Validate } from "class-validator";

export class LoginDto {
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
}
