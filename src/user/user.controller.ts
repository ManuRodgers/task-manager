import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  Patch,
  Delete,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto/user.dto';

export interface Result<T> {
  statusCode?: number;
  message?: string | T;
  data?: T;
  error?: T;
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<Result<User>> {
    const isValidate = await this.allowedUpdateValidation(createUserDto);
    if (!isValidate) {
      return new BadRequestException().message;
    }
    const res = await this.userService.create(createUserDto);
    if (res.email) {
      return {
        statusCode: HttpStatus.CREATED,
        message: 'create user successfully',
        data: res,
      };
    }
    return { message: res, statusCode: HttpStatus.BAD_REQUEST };
  }
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto): Promise<Result<User>> {
    const actualLoginFields = Object.keys(loginUserDto);
    const allowedLoginFields = ['email', 'password'];
    const isValidate = actualLoginFields.every(actualLoginField =>
      allowedLoginFields.includes(actualLoginField),
    );
    if (!isValidate) {
      return new BadRequestException().message;
    }
    const res = await this.userService.login(loginUserDto);
    if (res.email) {
      return {
        statusCode: HttpStatus.OK,
        message: 'login successfully',
        data: res,
      };
    }
    return {
      message: 'email or password error',
      error: res,
    };
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<User> {
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

  private async allowedUpdateValidation(
    dto: CreateUserDto | UpdateUserDto,
  ): Promise<boolean> {
    const updates = Object.keys(dto);
    const allowedUpdates = ['name', 'password', 'email', 'age'];
    return await updates.every(update => allowedUpdates.includes(update));
  }
}
