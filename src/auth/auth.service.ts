import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async createToken(user: User): Promise<string> {
    const { email } = user;
    const payload: IJwtPayload = { email };
    return await this.jwtService.sign(payload);
  }

  async validateUser(payload: IJwtPayload): Promise<User> {
    // put some validation logic here
    // for example query user by id/email/username
    return await this.userService.findOneByEmail(payload.email);
  }
}
