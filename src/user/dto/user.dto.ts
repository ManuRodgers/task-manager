import {
  IsString,
  IsNumber,
  IsEmail,
  MinLength,
  IsOptional,
} from 'class-validator';
import { User } from '../user.model';

export class CreateUserDto {
  @IsString()
  readonly name: User['name'];

  @IsString()
  @MinLength(7)
  readonly password: User['password'];

  @IsEmail()
  readonly email: User['email'];

  @IsNumber()
  readonly age: User['age'];
}
export class LoginUserDto {
  @IsEmail()
  readonly email: User['email'];

  @IsString()
  @MinLength(7)
  readonly password: User['password'];
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly name?: User['name'];

  @IsString()
  @MinLength(7)
  @IsOptional()
  readonly password?: User['password'];

  @IsEmail()
  @IsOptional()
  readonly email?: User['email'];

  @IsNumber()
  @IsOptional()
  readonly age?: User['age'];
}
