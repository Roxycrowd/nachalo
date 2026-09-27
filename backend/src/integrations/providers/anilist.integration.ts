import { Injectable, NotImplementedException } from '@nestjs/common';
import {
  INTEGRATION_PROVIDER_IDS,
  VIBE_CATEGORIES,
  type IntegrationAccountContext,
  type IntegrationProvider,
  type NormalizedVibeItem,
} from '../contracts/integration-provider';

@Injectable()
export class AniListIntegration implements IntegrationProvider {
  readonly id = INTEGRATION_PROVIDER_IDS.anilist;
  readonly displayName = 'AniList';
  readonly categories = [VIBE_CATEGORIES.anime];

  fetchNormalizedItems(
    _account: IntegrationAccountContext,
  ): Promise<NormalizedVibeItem[]> {
    return Promise.reject(
      new NotImplementedException('Интеграция AniList пока не реализована'),
    );
  }
}
