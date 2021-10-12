export declare enum Environment {
    Development = "development",
    Production = "production"
}
declare class EnvironmentVariables {
    NODE_ENV: Environment;
    PORT: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
}
export declare function validate(config: Record<string, unknown>): EnvironmentVariables;
export {};
