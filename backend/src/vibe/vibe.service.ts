import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { stripSensitiveMetadata } from '../common/security/strip-sensitive';
import { PrismaService } from '../prisma/prisma.service';

const vibeItemSelect = {
  id: true,
  category: true,
  source: true,
  sourceItemId: true,
  name: true,
  weight: true,
  metadata: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.VibeItemSelect;

export interface PublicVibeItem {
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

@Injectable()
export class VibeService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(userId: string): Promise<{ items: PublicVibeItem[] }> {
    const items = await this.prisma.vibeItem.findMany({
      where: { userId },
      select: vibeItemSelect,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    return {
      items: items.map((item) => ({
        id: item.id,
        category: item.category,
        source: item.source,
        sourceItemId: item.sourceItemId,
        name: item.name,
        weight: item.weight,
        metadata: stripSensitiveMetadata(item.metadata),
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    };
  }
}
