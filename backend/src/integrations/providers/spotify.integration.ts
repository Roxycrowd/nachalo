import { Injectable, NotImplementedException } from '@nestjs/common';
import {
  INTEGRATION_PROVIDER_IDS,
  VIBE_CATEGORIES,
  type IntegrationAccountContext,
  type IntegrationProvider,
  type NormalizedVibeItem,
} from '../contracts/integration-provider';

@Injectable()
export class SpotifyIntegration implements IntegrationProvider {
  readonly id = INTEGRATION_PROVIDER_IDS.spotify;
  readonly displayName = 'Spotify';
  readonly categories = [VIBE_CATEGORIES.music];

  fetchNormalizedItems(
    _account: IntegrationAccountContext,
  ): Promise<NormalizedVibeItem[]> {
    return Promise.reject(
      new NotImplementedException('Интеграция Spotify пока не реализована'),
    );
  }
}
