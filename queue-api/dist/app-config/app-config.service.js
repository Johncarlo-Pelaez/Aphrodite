"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const env_validate_1 = require("./env.validate");
let AppConfigService = class AppConfigService {
    constructor(configService) {
        this.configService = configService;
    }
    get nodeEnv() {
        return this.configService.get('NODE_ENV') || env_validate_1.Environment.Development;
    }
    get port() {
        return this.configService.get('PORT') || 3000;
    }
    get dbHost() {
        return this.configService.get('DB_HOST') || 'localhost';
    }
    get dbPort() {
        return this.configService.get('DB_PORT') || 1433;
    }
    get dbUser() {
        return this.configService.get('DB_USER') || 'sa';
    }
    get dbPassword() {
        return this.configService.get('DB_PASSWORD');
    }
    get dbName() {
        return this.configService.get('DB_NAME');
    }
    get redisHost() {
        return this.configService.get('REDIS_HOST') || 'localhost';
    }
    get redisPort() {
        return this.configService.get('REDIS_PORT') || 6379;
    }
    get filePath() {
        return this.configService.get('FILE_PATH');
    }
};
AppConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppConfigService);
exports.AppConfigService = AppConfigService;
//# sourceMappingURL=app-config.service.js.map