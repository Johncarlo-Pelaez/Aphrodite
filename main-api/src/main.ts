import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfigModule, AppConfigService, Environment } from './app-config';
import { AppModule } from './app.module';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');

  const appConfigService = app
    .select(AppConfigModule)
    .get(AppConfigService, { strict: true });

  if (appConfigService.nodeEnv === Environment.Development) {
    const config = new DocumentBuilder()
      .setTitle("Amicassa's RIS Main API")
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api', app, document);
  }

  await app.listen(appConfigService.port);
  const url = await app.getUrl();
  logger.log(`App is running on ${url}`);
}
bootstrap();
