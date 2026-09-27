import { randomBytes } from 'crypto';
import type { AppConfigService } from '../../config/app-config.service';
import type { PrismaService } from '../../prisma/prisma.service';
import { ConnectedAccountStore } from './connected-account.store';
import { decryptToken } from './token-cipher';

describe('ConnectedAccountStore', () => {
  it('persists ciphertext and returns an account without tokens', async () => {
    const key = randomBytes(32).toString('base64');
    const stored: { accessToken?: string; refreshToken?: string | null } = {};
    const createdAt = new Date('2026-01-01T00:00:00.000Z');
    const prisma = {
      connectedAccount: {
        upsert: (args: {
          create: { accessToken: string; refreshToken: string | null };
        }) => {
          stored.accessToken = args.create.accessToken;
          stored.refreshToken = args.create.refreshToken;
          return Promise.resolve({
            id: 'acc_1',
            provider: 'spotify',
            providerUserId: 'remote',
            expiresAt: null,
            createdAt,
            updatedAt: createdAt,
            accessToken: args.create.accessToken,
            refreshToken: args.create.refreshToken,
          });
        },
        findUnique: () =>
          Promise.resolve({
            userId: 'user_1',
            provider: 'spotify',
            providerUserId: 'remote',
            expiresAt: null,
            accessToken: stored.accessToken,
            refreshToken: stored.refreshToken,
          }),
      },
    };

    const store = new ConnectedAccountStore(
      prisma as unknown as PrismaService,
      { tokenEncryptionKey: () => key } as unknown as AppConfigService,
    );

    const created = await store.save({
      userId: 'user_1',
      provider: 'spotify',
      providerUserId: 'remote',
      accessToken: 'plain-access',
      refreshToken: 'plain-refresh',
      expiresAt: null,
    });
    const secrets = await store.readSecrets('user_1', 'spotify');

    expect(stored.accessToken).not.toContain('plain-access');
    expect(stored.refreshToken).not.toContain('plain-refresh');
    expect(JSON.stringify(created)).not.toContain('plain-access');
    expect(secrets?.accessToken).toBe('plain-access');
    expect(secrets?.refreshToken).toBe('plain-refresh');
    expect(decryptToken(stored.accessToken ?? '', key)).toBe('plain-access');
  });
});
