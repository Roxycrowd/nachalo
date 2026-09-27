import { randomBytes } from 'crypto';
import { decryptToken, encryptToken } from './token-cipher';

describe('token cipher', () => {
  const key = randomBytes(32).toString('base64');

  it('round-trips a token without storing it in plaintext', () => {
    const secret = 'spotify-access-token-example';
    const encrypted = encryptToken(secret, key);

    expect(encrypted).not.toContain(secret);
    expect(decryptToken(encrypted, key)).toBe(secret);
  });

  it('produces a different payload each time', () => {
    const first = encryptToken('same-token', key);
    const second = encryptToken('same-token', key);
    expect(first).not.toBe(second);
  });

  it('rejects a tampered payload', () => {
    const encrypted = encryptToken('same-token', key);
    const tampered = `${encrypted.slice(0, -2)}aa`;
    expect(() => decryptToken(tampered, key)).toThrow();
  });
});
