import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
} from "@nestjs/common";
import { LoginDto } from "./dtos/login.dto";
import { AuthService } from "./auth.service";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ControllerExceptionFilter } from "src/infra/filters/filter-errors";
import { IsAuthDto } from "./dtos/is-auth.dto";

export interface IAuthController {
  login(loginDto: LoginDto): Promise<string>;
  isAuthenticated(isAuthDto: IsAuthDto): Promise<boolean>;
}

@ApiTags("Auth")
@UseFilters(new ControllerExceptionFilter())
@Controller("auth")
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Authentication",
    type: "",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Not Found",
  })
  async login(@Body() loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;
    return await this.authService.login(email, password);
  }

  @Post("isAuth")
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: IsAuthDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Is Authenticated or Isn't Authenticated",
  })
  async isAuthenticated(@Body() isAuthDto: IsAuthDto): Promise<boolean> {
    return await this.authService.isAuthenticated(isAuthDto.token);
  }
}
