import { createParamDecorator } from '@nestjs/common';

export const GetUserId = createParamDecorator((): number => {
  return 1;
});
