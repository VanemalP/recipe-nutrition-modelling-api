import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const Token = createParamDecorator((data, req: Request) => {
  return  req.headers.authorization;
});
