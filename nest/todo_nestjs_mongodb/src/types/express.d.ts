import { JwtPayloadForToken } from 'src/auth/auth.interfaces';

declare module 'express' {
  interface Request {
    user?: JwtPayloadForToken;
  }
}
