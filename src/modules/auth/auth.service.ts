import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { User } from "../user/user.entity";
import { jwtExpiration } from "src/conf/api.conf";
import { UserService } from "../user/user.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectAutoService } from "src/decorators/inject-auto-service";

export interface IAuthService {
  login(email: string, password: string): Promise<string>;
  isAuthenticated(token: string): Promise<boolean>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectAutoService(User)
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: jwtExpiration,
    });

    return { token };
  }

  async isAuthenticated(token: string): Promise<boolean> {
    try {
      this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      return true;
    } catch (error) {
      return false;
    }
  }
}
