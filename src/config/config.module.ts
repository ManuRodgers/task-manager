import { Module } from '@nestjs/common';
import { EnvConfigService } from './env.config.service';

@Module({
  providers: [
    {
      provide: EnvConfigService,
      useValue: new EnvConfigService('./development.env'),
    },
  ],
  exports: [EnvConfigService],
})
export class ConfigModule {}
