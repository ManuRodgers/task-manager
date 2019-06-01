import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '../config/config.module';
import { EnvConfigService } from '../config/env.config.service';
@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (envConfigService: EnvConfigService) => {
        return {
          defaultStrategy: envConfigService.get('DEFAULT_STRATEGY'),
        };
      },
      inject: [EnvConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (envConfigService: EnvConfigService) => {
        console.log(envConfigService.get('JWT_SECRET'));
        return {
          secret: envConfigService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: 3600,
          },
        };
      },
      inject: [EnvConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, AuthService, JwtStrategy],
})
export class AuthModule {}
