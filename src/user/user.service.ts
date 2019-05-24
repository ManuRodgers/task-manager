import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';
import { User } from './user.model';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: ModelType<User> & typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userModel.create(createUserDto);
    } catch (error) {
      return error.message;
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<User> {
    const { email, password } = loginUserDto;
    return await this.userModel.findByCredential(email, password);
  }

  async findAll(): Promise<User[] | null> {
    return await this.userModel.find().exec();
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
