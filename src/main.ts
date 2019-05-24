import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { resolve } from 'path';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/AnyException.filter';

declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useStaticAssets(resolve(__dirname, '../src/public'), {
    prefix: '/public',
  });
  await app.listen(3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
