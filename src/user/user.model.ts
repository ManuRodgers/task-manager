import { UnauthorizedException } from '@nestjs/common';
import {
  arrayProp,
  prop,
  Typegoose,
  instanceMethod,
  pre,
  InstanceType,
  staticMethod,
  ModelType,
} from 'typegoose';
import { IsString, IsEmail, IsNumber } from 'class-validator';
import * as bcrypt from 'bcrypt';

@pre<User>('save', async function(next) {
  const user = this;
  // create or update
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  await next();
})
export class User extends Typegoose {
  @IsString()
  @prop({ required: true, trim: true })
  name: string;

  @IsString()
  @prop({
    required: true,
    trim: true,
    minlength: 7,
    validate: {
      validator: value => {
        if (value.toLowerCase().includes('password')) {
          return false;
        }
      },
      message: '{VALUE} cannot contain password',
    },
  })
  password: string;

  @IsEmail()
  @prop({ required: true, trim: true, unique: true, lowercase: true })
  email: string;

  @IsNumber()
  @prop({ required: true })
  age: number;

  @IsString()
  @arrayProp({
    items: String,
    required: false,
  })
  tokens?: string[];

  @staticMethod
  static async findByCredential(
    this: ModelType<User> & typeof User,
    email: string,
    password: string,
  ): Promise<InstanceType<User>> {
    const loggingUser = await this.findOne({ email });
    if (!loggingUser) {
      return new UnauthorizedException('email not exist').message;
    }
    const isMatch = await bcrypt.compare(password, loggingUser.password);
    if (!isMatch) {
      return new UnauthorizedException('password error').message;
    }
    return loggingUser;
  }
}
