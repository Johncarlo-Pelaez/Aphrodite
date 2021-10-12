"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_config_1 = require("./app-config");
const app_module_1 = require("./app.module");
const logger = new common_1.Logger('Main');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const appConfigService = app
        .select(app_config_1.AppConfigModule)
        .get(app_config_1.AppConfigService, { strict: true });
    await app.listen(appConfigService.port);
    const url = await app.getUrl();
    logger.log(`App is running on ${url}`);
}
bootstrap();
//# sourceMappingURL=main.js.map