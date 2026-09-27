import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { IngestionResult } from './ingestion/vibe-ingestion.service';
import { VibeIngestionService } from './ingestion/vibe-ingestion.service';
import {
  CONNECTED_ACCOUNT_PUBLIC_SELECT,
  toPublicConnectedAccount,
  type PublicConnectedAccount,
} from './public-connected-account';
import { IntegrationRegistry } from './registry/integration.registry';
import { ConnectedAccountStore } from './tokens/connected-account.store';

export interface IntegrationProviderSummary {
  id: string;
  displayName: string;
  categories: readonly string[];
  status: 'not_implemented';
}

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly registry: IntegrationRegistry,
    private readonly accounts: ConnectedAccountStore,
    private readonly ingestion: VibeIngestionService,
    private readonly prisma: PrismaService,
  ) {}

  listProviders(): IntegrationProviderSummary[] {
    return this.registry.list().map((provider) => ({
      id: provider.id,
      displayName: provider.displayName,
      categories: provider.categories,
      status: 'not_implemented',
    }));
  }

  async listAccounts(userId: string): Promise<PublicConnectedAccount[]> {
    const records = await this.prisma.connectedAccount.findMany({
      where: { userId },
      select: CONNECTED_ACCOUNT_PUBLIC_SELECT,
      orderBy: { createdAt: 'asc' },
    });
    return records.map((record) => toPublicConnectedAccount(record));
  }

  async sync(userId: string, providerId: string): Promise<IngestionResult> {
    const provider = this.registry.get(providerId);
    const account = await this.accounts.readSecrets(userId, provider.id);
    if (!account) {
      throw new NotFoundException(
        `Сервис ${provider.displayName} ещё не подключён`,
      );
    }

    const items = await provider.fetchNormalizedItems(account);
    return this.ingestion.ingest(userId, provider.id, items);
  }
}
