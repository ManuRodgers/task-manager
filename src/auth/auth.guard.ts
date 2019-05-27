import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from '../user/user.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest<Request>();
      const currentToken = request.header('Authorization').split(' ')[1];
      const currentEmail = this.jwtService.verify(currentToken).email;
      const currentUser = await this.userService.findOneByEmail(currentEmail);
      if (currentUser.tokens.includes(currentToken)) {
        request.user = currentUser;
        return true;
      } else {
        return new UnauthorizedException().message;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
