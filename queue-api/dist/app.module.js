"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const app_config_1 = require("./app-config");
const consumers_1 = require("./consumers");
const repositories_1 = require("./repositories");
const logger = new common_1.Logger('AppModule');
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            app_config_1.AppConfigModule,
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [app_config_1.AppConfigModule],
                useFactory: (appConfigService) => ({
                    type: 'mssql',
                    host: appConfigService.dbHost,
                    port: appConfigService.dbPort,
                    username: appConfigService.dbUser,
                    password: appConfigService.dbPassword,
                    database: appConfigService.dbName,
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: false,
                    options: {
                        encrypt: appConfigService.nodeEnv !== app_config_1.Environment.Development,
                    },
                }),
                inject: [app_config_1.AppConfigService],
                connectionFactory: async (options) => {
                    logger.log('Connecting to the database...');
                    const connection = await (0, typeorm_2.createConnection)(options);
                    logger.log('Successfully connected to the database');
                    return connection;
                },
            }),
            bull_1.BullModule.forRootAsync({
                imports: [app_config_1.AppConfigModule],
                useFactory: async (appConfigService) => ({
                    redis: {
                        host: appConfigService.redisHost,
                        port: appConfigService.redisPort,
                    },
                }),
                inject: [app_config_1.AppConfigService],
            }),
            bull_1.BullModule.registerQueue({
                name: 'document',
            }),
        ],
        providers: [repositories_1.DocumentRepository, consumers_1.DocumentConsumer, common_1.Logger],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map