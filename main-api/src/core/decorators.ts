import {
  applyDecorators,
  createParamDecorator,
  Type,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export const GetUserId = createParamDecorator((): number => {
  return 1;
});

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              count: {
                type: 'number',
                example: 1,
              },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};

export function ApiFile(
  fieldName = 'file',
  required = false,
  localOptions?: MulterOptions,
) {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, localOptions)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: required ? [fieldName] : [],
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
}

export interface AzureUser {
  aud: string;
  iss: string;
  iat: number;
  nbf: number;
  exp: number;
  name: string;
  nonce: string;
  oid: string;
  preferred_username: string;
  rh: string;
  sub: string;
  tid: string;
  uti: string;
  ver: string;
}

export const GetAzureUser = createParamDecorator((_data, req) => {
  return req.args[0].user;
});

export const GetAccessToken = createParamDecorator((_data, req) => {
  return req.args[0].headers['access-token'];
});
