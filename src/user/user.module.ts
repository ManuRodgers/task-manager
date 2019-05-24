import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { User } from './user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypegooseModule.forFeature(User)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
