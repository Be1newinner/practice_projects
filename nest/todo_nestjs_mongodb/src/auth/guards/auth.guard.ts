import { Request } from 'express';
import { TokenService } from './../utils/jwt';
import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer '))
      throw new UnauthorizedException('Missing token');

    const token = authHeader.split(' ')[1];

    try {
      const payload = this.tokenService.verifyToken(token);
      req.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
