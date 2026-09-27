import { Injectable, NotImplementedException } from '@nestjs/common';
import {
  INTEGRATION_PROVIDER_IDS,
  VIBE_CATEGORIES,
  type IntegrationAccountContext,
  type IntegrationProvider,
  type NormalizedVibeItem,
} from '../contracts/integration-provider';

@Injectable()
export class SteamIntegration implements IntegrationProvider {
  readonly id = INTEGRATION_PROVIDER_IDS.steam;
  readonly displayName = 'Steam';
  readonly categories = [VIBE_CATEGORIES.games];

  fetchNormalizedItems(
    _account: IntegrationAccountContext,
  ): Promise<NormalizedVibeItem[]> {
    return Promise.reject(
      new NotImplementedException('Интеграция Steam пока не реализована'),
    );
  }
}
