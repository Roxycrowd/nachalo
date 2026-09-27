export interface SessionUser {
  id: string;
  email: string;
  username: string;
  name: string | null;
  age: number | null;
  city: string | null;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationProviderSummary {
  id: string;
  displayName: string;
  categories: string[];
  status: "not_implemented";
}

export interface ConnectedAccount {
  id: string;
  provider: string;
  providerUserId: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VibeItem {
  id: string;
  category: string;
  source: string;
  sourceItemId: string;
  name: string;
  weight: number | null;
  metadata: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface HealthStatus {
  status: "ok";
  service: "vibe-api";
  database: "up";
}
