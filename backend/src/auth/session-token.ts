import { createHmac, timingSafeEqual } from 'crypto';

interface SessionClaims {
  sub: string;
  exp: number;
}

export function signSessionToken(
  userId: string,
  secret: string,
  expiresInSeconds: number,
): string {
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const body = encode({
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  });
  const signature = sign(`${header}.${body}`, secret);
  return `${header}.${body}.${signature}`;
}

export function verifySessionToken(
  token: string,
  secret: string,
): SessionClaims {
  const [header, body, signature] = token.split('.');
  if (!header || !body || !signature || token.split('.').length !== 3) {
    throw new Error('Invalid session token');
  }

  const expected = sign(`${header}.${body}`, secret);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    throw new Error('Invalid session token');
  }

  const payload: unknown = JSON.parse(
    Buffer.from(body, 'base64url').toString('utf8'),
  );
  if (
    !isSessionClaims(payload) ||
    payload.exp <= Math.floor(Date.now() / 1000)
  ) {
    throw new Error('Invalid session token');
  }

  return payload;
}

function sign(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function encode(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function isSessionClaims(value: unknown): value is SessionClaims {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record.sub === 'string' && typeof record.exp === 'number';
}
