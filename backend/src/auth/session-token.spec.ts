import { signSessionToken, verifySessionToken } from './session-token';

describe('session token', () => {
  const secret = 'test-only-jwt-secret';

  it('round-trips the user id', () => {
    const token = signSessionToken('user_1', secret, 60);
    expect(verifySessionToken(token, secret).sub).toBe('user_1');
  });

  it('rejects a tampered token and a wrong secret', () => {
    const token = signSessionToken('user_1', secret, 60);
    expect(() => verifySessionToken(`${token}x`, secret)).toThrow();
    expect(() => verifySessionToken(token, 'another-secret-value')).toThrow();
  });

  it('rejects an expired token', () => {
    const token = signSessionToken('user_1', secret, -10);
    expect(() => verifySessionToken(token, secret)).toThrow();
  });
});
