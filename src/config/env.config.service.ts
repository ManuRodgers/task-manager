import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from '@hapi/joi';

export interface IEnvConfig {
  [key: string]: string;
}
@Injectable()
export class EnvConfigService {
  private readonly envConfig: IEnvConfig;
  constructor(dotEnvFilePath: string) {
    const config = dotenv.parse(fs.readFileSync(dotEnvFilePath));
    this.envConfig = EnvConfigService.validateEnvConfig(config);
  }

  public get(key: string): string {
    return this.envConfig[key];
  }

  private static validateEnvConfig(envConfig: IEnvConfig): IEnvConfig {
    const envConfigSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
      PORT: Joi.number().default(3000),
      API_AUTH_ENABLED: Joi.boolean().required(),
      DEFAULT_STRATEGY: Joi.string().required(),
      JWT_SECRET: Joi.string().required(),
      MONGODB_URI: Joi.string().required(),
    });
    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envConfigSchema,
    );
    if (error) {
      throw new Error(`Config validation error ${error.message}`);
    }
    return validatedEnvConfig;
  }
}
