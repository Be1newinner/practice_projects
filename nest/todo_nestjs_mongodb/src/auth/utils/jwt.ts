import { ConfigService } from '@nestjs/config';
import { JwtPayloadForToken, JwtStringValue } from '../auth.interfaces';
import * as jwt from 'jsonwebtoken';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class TokenService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;

  constructor(private readonly configService: ConfigService) {
    this.jwtSecret = configService.getOrThrow<string>('JWT_SECRET');
    this.jwtExpiresIn =
      configService.getOrThrow<JwtStringValue>('JWT_EXPIRATION');
  }

  generateToken(payload: JwtPayloadForToken, jti?: string): string {
    return jwt.sign({ ...payload, jti: jti || randomUUID() }, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn as JwtStringValue,
    });
  }

  verifyToken<T = JwtPayloadForToken>(token: string): T {
    try {
      return jwt.verify(token, this.jwtSecret) as T;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
