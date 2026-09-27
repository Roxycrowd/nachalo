import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { stripSensitiveMetadata } from '../../common/security/strip-sensitive';
import type { NormalizedVibeItem } from '../contracts/integration-provider';
import { PrismaService } from '../../prisma/prisma.service';
import { assertNormalizedVibeItems } from './assert-normalized-vibe-items';

export interface IngestionResult {
  upserted: number;
}

@Injectable()
export class VibeIngestionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Replaces the user's items for one source with a normalized batch.
   * Provider-specific payloads never reach this method.
   */
  async ingest(
    userId: string,
    source: string,
    items: NormalizedVibeItem[],
  ): Promise<IngestionResult> {
    assertNormalizedVibeItems(source, items);

    await this.prisma.$transaction(async (tx) => {
      if (items.length === 0) {
        await tx.vibeItem.deleteMany({ where: { userId, source } });
        return;
      }

      await tx.vibeItem.deleteMany({
        where: {
          userId,
          source,
          sourceItemId: { notIn: items.map((item) => item.sourceItemId) },
        },
      });

      for (const item of items) {
        const metadata = toJsonMetadata(item.metadata);
        await tx.vibeItem.upsert({
          where: {
            userId_source_sourceItemId: {
              userId,
              source: item.source,
              sourceItemId: item.sourceItemId,
            },
          },
          create: {
            userId,
            category: item.category,
            source: item.source,
            sourceItemId: item.sourceItemId,
            name: item.name,
            weight: item.weight,
            metadata,
          },
          update: {
            category: item.category,
            name: item.name,
            weight: item.weight,
            metadata,
          },
        });
      }
    });

    return { upserted: items.length };
  }
}

function toJsonMetadata(
  metadata: Record<string, unknown> | null,
): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  if (metadata === null) {
    return Prisma.JsonNull;
  }
  const cleaned = stripSensitiveMetadata(metadata);
  return JSON.parse(JSON.stringify(cleaned)) as Prisma.InputJsonValue;
}
