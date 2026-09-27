import { Injectable, NotFoundException } from '@nestjs/common';
import type { IntegrationProvider } from '../contracts/integration-provider';
import { AniListIntegration } from '../providers/anilist.integration';
import { SpotifyIntegration } from '../providers/spotify.integration';
import { SteamIntegration } from '../providers/steam.integration';

@Injectable()
export class IntegrationRegistry {
  private readonly providers: Map<string, IntegrationProvider>;

  constructor(
    spotify: SpotifyIntegration,
    anilist: AniListIntegration,
    steam: SteamIntegration,
  ) {
    const list: IntegrationProvider[] = [spotify, anilist, steam];
    this.providers = new Map(list.map((provider) => [provider.id, provider]));
  }

  list(): IntegrationProvider[] {
    return [...this.providers.values()];
  }

  get(id: string): IntegrationProvider {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new NotFoundException('Неизвестный сервис');
    }
    return provider;
  }
}
