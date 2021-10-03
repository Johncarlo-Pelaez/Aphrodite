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

| Name        | Description                 | Type                                  | Default         |
| ----------- | --------------------------- | ------------------------------------- | --------------- |
| NODE_ENV    | App environment             | `'development'` &#124; `'production'` | `'development'` |
| PORT        | App port                    | number                                | `3000`          |
| DB_HOST     | Database host               | string                                | `'localhost'`   |
| DB_PORT     | Database host port          | number                                | `1433`          |
| DB_USER     | Database username           | string                                | `'sa'`          |
| DB_PASSWORD | Database password           | string                                |
| DB_NAME     | Database name to connect to | string                                |
