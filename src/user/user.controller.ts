import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  Patch,
  Delete,
  HttpStatus,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './user.model';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto/user.dto';
import { IResult } from '../interfaces/result';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<IResult<User>> {
    const res = await this.userService.create(createUserDto);
    if (res.email) {
      return {
        statusCode: HttpStatus.CREATED,
        message: 'create user successfully',
        data: res,
      };
    }
    return { error: res };
  }
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto): Promise<IResult<User>> {
    const res = await this.userService.login(loginUserDto);
    if (res.email) {
      return {
        statusCode: HttpStatus.OK,
        message: 'login successfully',
        data: res,
      };
    }
    return {
      error: res,
    };
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request): Promise<IResult<User>> {
    try {
      const currentToken = req.header('authorization').split(' ')[1];
      const currentUser = req.user;
      console.log(currentToken, 'currentToken');
      console.log(currentUser, 'currentUser');
      req.user.tokens = req.user.tokens.filter(token => token !== currentToken);
      console.log(req.user.tokens);
      await req.user.save();
      return { message: 'logout' };
    } catch (error) {
      return new UnauthorizedException().message;
    }
  }

  @Post('/logoutAll')
  @UseGuards(AuthGuard)
  async logoutAll(@Req() req: Request): Promise<IResult<User>> {
    try {
      const { user } = req;
      if (!user) {
        return new UnauthorizedException().message;
      }
      user.tokens = [];
      await user.save();
      return { statusCode: 200, message: 'logout all ' };
    } catch (error) {
      console.error(error);
    }
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async getMyProfile(@Req() req: Request): Promise<IResult<User>> {
    try {
      const currentToken = req.header('authorization').split(' ')[1];
      const currentUser = req.user;
      const currentTokens = req.user.tokens;
      console.log(currentUser);
      if (!currentTokens.includes(currentToken)) {
        return new UnauthorizedException().message;
      }
      return await currentUser;
    } catch (error) {
      return new UnauthorizedException().message;
    }
  }

  @Patch('/me')
  @UseGuards(AuthGuard)
  async updateProfile(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IResult<User>> {
    try {
      const { user, body } = req;
      if (!user) {
        return new UnauthorizedException().message;
      }
      const updates = Object.keys(body);
      updates.forEach(update => (user[update] = body[update]));
      await user.save();
      return {
        statusCode: 200,
        message: 'update profile successfully',
        data: user,
      };
    } catch (error) {
      return { error };
    }
  }

  @Delete('/me')
  @UseGuards(AuthGuard)
  async deleteYourself(@Req() req: Request): Promise<IResult<User>> {
    try {
      const { user } = req;
      if (!user) {
        return new UnauthorizedException().message;
      }
      await user.remove();
      return { statusCode: 200, message: 'delete successfully', data: user };
    } catch (error) {
      console.error(error);
    }
  }

  @Get('/:id')
  async findOne(@Param('id') id: number, @Req() req: Request): Promise<User> {
    console.log(req.user);
    console.log(req.header('authorization').split(' ')[1]);
    return await this.userService.findOne(id);
  }

  @Patch('/:id')
  async updateOne(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateOne(id, updateUserDto);
  }

  @Delete('/:id')
  async deleteOne(@Param('id') id: number): Promise<User> {
    return await this.userService.deleteOne(id);
  }

  // private async allowedPropertiesValidation(
  //   dto: CreateUserDto | UpdateUserDto | LoginUserDto,
  //   allowedProperties: string[],
  // ): Promise<boolean> {
  //   const actualProperties = Object.keys(dto);
  //   return await actualProperties.every(actualProperty =>
  //     allowedProperties.includes(actualProperty),
  //   );
  // }
}
