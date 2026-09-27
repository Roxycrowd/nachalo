import { Module } from '@nestjs/common';
import { SessionModule } from '../auth/session.module';
import { VibeIngestionService } from './ingestion/vibe-ingestion.service';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { AniListIntegration } from './providers/anilist.integration';
import { SpotifyIntegration } from './providers/spotify.integration';
import { SteamIntegration } from './providers/steam.integration';
import { IntegrationRegistry } from './registry/integration.registry';
import { ConnectedAccountStore } from './tokens/connected-account.store';

@Module({
  imports: [SessionModule],
  controllers: [IntegrationsController],
  providers: [
    SpotifyIntegration,
    AniListIntegration,
    SteamIntegration,
    IntegrationRegistry,
    VibeIngestionService,
    ConnectedAccountStore,
    IntegrationsService,
  ],
})
export class IntegrationsModule {}
