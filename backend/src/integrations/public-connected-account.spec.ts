import {
  CONNECTED_ACCOUNT_PUBLIC_SELECT,
  toPublicConnectedAccount,
} from './public-connected-account';

describe('public connected account', () => {
  it('does not select OAuth tokens', () => {
    expect(Object.keys(CONNECTED_ACCOUNT_PUBLIC_SELECT)).not.toEqual(
      expect.arrayContaining(['accessToken', 'refreshToken']),
    );
  });

  it('drops token fields from the response shape', () => {
    const accessToken = 'secret-access-token';
    const refreshToken = 'secret-refresh-token';
    const createdAt = new Date('2026-01-01T00:00:00.000Z');
    const publicAccount = toPublicConnectedAccount({
      id: 'acc_1',
      provider: 'spotify',
      providerUserId: 'user-1',
      expiresAt: null,
      createdAt,
      updatedAt: createdAt,
      accessToken,
      refreshToken,
    });

    const serialized = JSON.stringify(publicAccount);
    expect(serialized).not.toContain(accessToken);
    expect(serialized).not.toContain(refreshToken);
    expect(publicAccount).toEqual({
      id: 'acc_1',
      provider: 'spotify',
      providerUserId: 'user-1',
      expiresAt: null,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    });
  });
});
