import { randomBytes } from 'crypto';

process.env.DATABASE_URL ??=
  'postgresql://vibe:vibe@127.0.0.1:5432/vibe?schema=public';
process.env.JWT_SECRET ??= 'test-only-jwt-secret';
process.env.TOKEN_ENCRYPTION_KEY ??= randomBytes(32).toString('base64');
process.env.FRONTEND_ORIGIN ??= 'http://localhost:3000';
process.env.PORT ??= '4000';
