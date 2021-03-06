import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';
import { User } from './user.model';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto/user.dto';
import { JwtStrategy } from '../auth/jwt.strategy';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: ModelType<User> & typeof User,
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const res = await this.userModel.create(createUserDto);
      if (res.email) {
        const { user, token } = await this.jwtStrategy.validate({
          email: res.email,
        });
        user.tokens = user.tokens.concat(token);
        await user.save();
        return user;
      } else {
        console.log(`sign up failed`);
        return res;
      }
    } catch (error) {
      return new BadRequestException(error).message;
    }
  }
  async login(loginUserDto: LoginUserDto): Promise<User> {
    const { email, password } = loginUserDto;
    const res = await this.userModel.findByCredential(email, password);
    try {
      if (res.email) {
        const { user, token } = await this.jwtStrategy.validate({
          email: res.email,
        });
        user.tokens = user.tokens.concat(token);
        await user.save();
        const updateUsers = await this.userModel
          .aggregate()
          .project({
            password: 0,
            avatar: 0,
            tasks: 0,
          })
          .match({
            email: user.email,
          });
        return updateUsers[0];
      } else {
        console.log(`login failed`);
        return res;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        return new BadRequestException().message;
      }
      return await user;
    } catch (error) {
      return new InternalServerErrorException().message;
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return new UnauthorizedException().message;
      }
      return await user;
    } catch (error) {
      console.error(error);
    }
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        return new NotFoundException().message;
      }
      const updatedProperties = Object.keys(updateUserDto);
      updatedProperties.forEach(
        updatedProperty =>
          (user[updatedProperty] = updateUserDto[updatedProperty]),
      );
      return await user.save();
    } catch (e) {
      return new InternalServerErrorException().message;
    }
  }

  async deleteOne(id: number): Promise<User> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id);
      if (!deletedUser) {
        return new BadRequestException().message;
      }
      return deletedUser;
    } catch (error) {
      return new InternalServerErrorException().message;
    }
  }
}
