import { BullModule } from '@nestjs/bull';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createConnection } from 'typeorm';
import { AppConfigModule, AppConfigService } from './app-config';
import { DocumentConsumer } from './consumers';
import {
  DocumentController,
  UserController,
  NomenclatureWhitelistController,
  NomenclatureLookupController,
  ActivityLogController,
  ReportController,
} from './controllers';
import { UtilsModule } from './utils/utils.module';
import { DocumentProducer } from './producers';
import {
  DocumentRepository,
  UserRepository,
  NomenclatureWhitelistRepository,
  NomenclatureLookupRepository,
  ActivityLogRepository,
  ReportRepository,
} from './repositories';
import { DocumentService } from './document-service';
import { QRService } from 'src/qr-service';
import { SalesForceService } from './sales-force-service';
import { SpringCMService } from './spring-cm-service';
import { PassportModule } from '@nestjs/passport';
import { AzureADStrategy } from './core';
import { AzureAdService } from './azure-ad-service';
import { ExcelService } from './excel-service';

const logger = new Logger('AppModule');

@Module({
  imports: [
    AppConfigModule,
    UtilsModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) => ({
        type: 'mssql',
        host: appConfigService.dbHost,
        port: appConfigService.dbPort,
        username: appConfigService.dbUser,
        password: appConfigService.dbPassword,
        database: appConfigService.dbName,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        options: {
          encrypt: false,
        },
      }),
      inject: [AppConfigService],
      connectionFactory: async (options) => {
        logger.log('Connecting to the database...');
        const connection = await createConnection(options);
        logger.log('Successfully connected to the database');
        return connection;
      },
    }),
    BullModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => ({
        redis: {
          host: appConfigService.redisHost,
          port: appConfigService.redisPort,
        },
      }),
      inject: [AppConfigService],
    }),
    BullModule.registerQueue({
      name: 'document',
    }),
    PassportModule,
  ],
  controllers: [
    DocumentController,
    UserController,
    NomenclatureWhitelistController,
    NomenclatureLookupController,
    ActivityLogController,
    ReportController,
  ],
  providers: [
    QRService,
    SalesForceService,
    SpringCMService,
    AzureAdService,
    DocumentService,
    DocumentRepository,
    UserRepository,
    DocumentProducer,
    DocumentConsumer,
    AzureADStrategy,
    NomenclatureWhitelistRepository,
    NomenclatureLookupRepository,
    ActivityLogRepository,
    ExcelService,
    ReportRepository,
  ],
})
export class AppModule {}
