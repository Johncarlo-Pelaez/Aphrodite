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

| Name               | Description                         | Type                                  | Default                             |
| ------------------ | ----------------------------------- | ------------------------------------- | ----------------------------------- |
| NODE_ENV           | App environment                     | `'development'` &#124; `'production'` | `'development'`                     |
| PORT               | App port                            | number                                | `3000`                              |
| DB_HOST            | Database host                       | string                                | `'localhost'`                       |
| DB_PORT            | Database host port                  | number                                | `1433`                              |
| DB_USER            | Database username                   | string                                | `'sa'`                              |
| DB_PASSWORD        | Database password                   | string                                |                                     |
| DB_NAME            | Database name to connect to         | string                                |                                     |
| REDIS_HOST         | Redis host                          | string                                | `'localhost'`                       |
| REDIS_PORT         | Redis host port                     | number                                | `6379`                              |
| FILE_PATH          | Staging files folder location       | string                                | `../files`                          |
| BARCODE_LICENSE    | Dynamsoft License                   | string                                |                                     |
| SALESFORCE_URL     | Sales Force API Base URl            | string                                | `http://alicas201.ayalaland.com.ph` |
| AZURE_AD_CLIENT_ID | Azure AD Client ID                  | string                                |                                     |
| AZURE_AD_TENANT_ID | Azure AD Tenant ID                  | string                                |                                     |
| MAIL_HOST          | Mailer Host                         | string                                |                                     |
| MAIL_PORT          | Mailer Port                         | string                                |                                     |
| MAIL_USER          | Mailer User Accout or Email Address | string                                |                                     |
| MAIL_PASSWORD      | Mailer Account or Email Password    | string                                |                                     |
| MAIL_FROM          | Maile From User Account             | string                                |                                     |
| BASE_URL           | Application Base URl                | string                                | `http://localhost:8080`             |
