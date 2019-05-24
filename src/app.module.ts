import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from './config/config.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Module({
  imports: [
    TypegooseModule.forRoot(`mongodb://127.0.0.1:27017/task-manager-api`, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    UserModule,
    TaskModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
