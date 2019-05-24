import { Injectable } from '@nestjs/common';
import { EnvConfigService } from './config/env.config.service';

@Injectable()
export class AppService {
  constructor(private readonly envConfigService: EnvConfigService) {}
  getHello(): string {
    return 'Hello World! GOAT Manu';
  }
}
