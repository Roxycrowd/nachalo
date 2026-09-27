export const INTEGRATION_PROVIDER_IDS = {
  spotify: 'spotify',
  anilist: 'anilist',
  steam: 'steam',
} as const;

export type IntegrationProviderId =
  (typeof INTEGRATION_PROVIDER_IDS)[keyof typeof INTEGRATION_PROVIDER_IDS];

export const VIBE_CATEGORIES = {
  music: 'music',
  anime: 'anime',
  games: 'games',
} as const;

/**
 * Tokens in this context are backend-only. Providers must not return them,
 * log them, or copy them into Vibe item metadata.
 */
export interface IntegrationAccountContext {
  userId: string;
  provider: string;
  providerUserId: string;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
}

export interface NormalizedVibeItem {
  category: string;
  source: string;
  sourceItemId: string;
  name: string;
  /** Unified importance from 0 to 1. Source-specific ratings belong in metadata. */
  weight: number | null;
  /** Must not contain access tokens, refresh tokens, or other credentials. */
  metadata: Record<string, unknown> | null;
}

/**
 * Contract for a connected service.
 * A provider fetches its own API and maps the payload into NormalizedVibeItem.
 * Shared persistence lives in VibeIngestionService, not in the provider.
 */
export interface IntegrationProvider {
  readonly id: IntegrationProviderId;
  readonly displayName: string;
  readonly categories: readonly string[];
  fetchNormalizedItems(
    account: IntegrationAccountContext,
  ): Promise<NormalizedVibeItem[]>;
}
