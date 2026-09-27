import { toSessionUser } from './session-user';

describe('toSessionUser', () => {
  it('returns profile fields and omits the password hash', () => {
    const passwordHash = '$2b$12$examplehash';
    const createdAt = new Date('2026-01-02T00:00:00.000Z');
    const credential = { email: 'alibek@example.com', passwordHash };
    const session = toSessionUser({
      id: 'user_1',
      username: 'alibek',
      name: 'Alibek',
      age: null,
      city: null,
      avatar: null,
      bio: null,
      createdAt,
      updatedAt: createdAt,
      credential,
    });

    expect(JSON.stringify(session)).not.toContain(passwordHash);
    expect(session.email).toBe('alibek@example.com');
    expect(session).not.toHaveProperty('passwordHash');
  });
});
