# Amicassa's RIS Main API

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Environment Variables

It will access the variables from the runtime environment else it will load from the `.env` file. You may copy `.env.example` to `.env`.

| Name               | Description                        | Type                                  | Default                             |
| ------------------ | ---------------------------------- | ------------------------------------- | ----------------------------------- |
| NODE_ENV           | App environment                    | `'development'` &#124; `'production'` | `'development'`                     |
| PORT               | App port                           | number                                | `3000`                              |
| DB_HOST            | Database host                      | string                                | `'localhost'`                       |
| DB_PORT            | Database host port                 | number                                | `1433`                              |
| DOMAIN             | Domain name ex. https://ris.com.ph | string                                | `http://localhost:8080`             |
| DB_USER            | Database username                  | string                                | `'sa'`                              |
| DB_PASSWORD        | Database password                  | string                                |                                     |
| DB_NAME            | Database name to connect to        | string                                |                                     |
| REDIS_HOST         | Redis host                         | string                                | `'localhost'`                       |
| REDIS_PORT         | Redis host port                    | number                                | `6379`                              |
| FILE_PATH          | Staging files folder location      | string                                | `../files`                          |
| BARCODE_LICENSE    | Dynamsoft License                  | string                                |                                     |
| SALESFORCE_URL     | Sales Force API Base URl           | string                                | `http://alicas201.ayalaland.com.ph` |
| AZURE_AD_CLIENT_ID | Azure AD Client ID                 | string                                |                                     |
| AZURE_AD_TENANT_ID | Azure AD Tenant ID                 | string                                |                                     |
| MAIL_HOST          | Mailer host                        | string                                |                                     |
| MAIL_PORT          | Mailer port                        | string                                |                                     |
| MAIL_USER          | Mailer accout or email address     | string                                |                                     |
| MAIL_PASSWORD      | Mailer accout or email password    | string                                |                                     |
| MAIL_FROM          | Mailer from user account           | string                                |                                     |
