import { Module } from '@nestjs/common';
import { EnvConfigService } from './env.config.service';
import * as path from 'path';

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
