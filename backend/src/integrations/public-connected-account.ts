import type { Prisma } from '@prisma/client';

export interface PublicConnectedAccount {
  id: string;
  provider: string;
  providerUserId: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const CONNECTED_ACCOUNT_PUBLIC_SELECT = {
  id: true,
  provider: true,
  providerUserId: true,
  expiresAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ConnectedAccountSelect;

export function toPublicConnectedAccount(account: {
  id: string;
  provider: string;
  providerUserId: string;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  accessToken?: string;
  refreshToken?: string | null;
}): PublicConnectedAccount {
  return {
    id: account.id,
    provider: account.provider,
    providerUserId: account.providerUserId,
    expiresAt: account.expiresAt ? account.expiresAt.toISOString() : null,
    createdAt: account.createdAt.toISOString(),
    updatedAt: account.updatedAt.toISOString(),
  };
}
