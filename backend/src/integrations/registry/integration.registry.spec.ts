import { NotImplementedException } from '@nestjs/common';
import { AniListIntegration } from '../providers/anilist.integration';
import { SpotifyIntegration } from '../providers/spotify.integration';
import { SteamIntegration } from '../providers/steam.integration';
import { IntegrationRegistry } from './integration.registry';

describe('IntegrationRegistry', () => {
  const registry = new IntegrationRegistry(
    new SpotifyIntegration(),
    new AniListIntegration(),
    new SteamIntegration(),
  );

  it('lists the planned providers without calling them', () => {
    expect(registry.list().map((provider) => provider.id)).toEqual([
      'spotify',
      'anilist',
      'steam',
    ]);
  });

  it('keeps provider sync unimplemented', async () => {
    await expect(
      registry.get('spotify').fetchNormalizedItems({
        userId: 'user_1',
        provider: 'spotify',
        providerUserId: 'remote',
        accessToken: 'must-stay-on-backend',
        refreshToken: null,
        expiresAt: null,
      }),
    ).rejects.toBeInstanceOf(NotImplementedException);
  });
});
