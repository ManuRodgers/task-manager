import { Module, forwardRef } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { User } from './user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypegooseModule.forFeature(User), forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
