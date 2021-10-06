import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppConfigModule, AppConfigService } from './app-config';
import { AppModule } from './app.module';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfigService = app
    .select(AppConfigModule)
    .get(AppConfigService, { strict: true });

  await app.listen(appConfigService.port);
  const url = await app.getUrl();
  logger.log(`App is running on ${url}`);
}
bootstrap();
