import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayloadForToken } from '../auth.interfaces';

export const CurrentUser = createParamDecorator(
  (field: keyof JwtPayloadForToken | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return field ? request.user?.[field] : request.user;
  },
);
