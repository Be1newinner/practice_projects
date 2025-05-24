import { z } from 'zod';

export const envSchema = z.object({
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRATION: z.string().default('1h'),
  PORT: z.coerce.number().default(3000),
});
