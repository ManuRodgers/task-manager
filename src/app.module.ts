import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from './config/config.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { EnvConfigService } from './config/env.config.service';

@Module({
  imports: [
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (envConfigService: EnvConfigService) => ({
        uri: envConfigService.get('MONGODB_URI'),
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }),
      inject: [EnvConfigService],
    }),
    UserModule,
    TaskModule,
    ConfigModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
