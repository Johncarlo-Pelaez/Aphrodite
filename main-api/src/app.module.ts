import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createConnection } from 'typeorm';
import { AppConfigModule, AppConfigService, Environment } from './app-config';
import { DocumentController, UserController } from './controllers';
import { DocumentRepository, UserRepository } from './repositories';

const logger = new Logger('AppModule');

@Module({
  imports: [
    AppConfigModule,
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
          encrypt: appConfigService.nodeEnv !== Environment.Development,
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
  ],
  controllers: [DocumentController, UserController],
  providers: [DocumentRepository, UserRepository],
})
export class AppModule {}
