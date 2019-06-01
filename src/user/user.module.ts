import { Module, forwardRef, BadRequestException } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from './user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { resolve } from 'path';

@Module({
  imports: [
    TypegooseModule.forFeature({
      typegooseClass: User,
      schemaOptions: { collection: 'users', timestamps: true },
    }),
    MulterModule.register({
      limits: {
        fileSize: 1000000,
      },
      fileFilter(
        req: any,
        file: any,
        callback: (error: any | null, acceptFile: boolean) => void,
      ): void {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/gm)) {
          return callback(
            new BadRequestException('Please upload an image'),
            false,
          );
        }
        callback(undefined, true);
      },
    }),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
