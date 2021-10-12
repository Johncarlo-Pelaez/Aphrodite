import { ConfigService } from '@nestjs/config';
import { Environment } from './env.validate';
export declare class AppConfigService {
    private readonly configService;
    constructor(configService: ConfigService);
    get nodeEnv(): Environment;
    get port(): number;
    get dbHost(): string;
    get dbPort(): number;
    get dbUser(): string;
    get dbPassword(): string;
    get dbName(): string;
    get redisHost(): string;
    get redisPort(): number;
    get filePath(): string;
}
