import { BadRequestException } from '@nestjs/common';
import type { PrismaService } from '../../prisma/prisma.service';
import { VibeIngestionService } from './vibe-ingestion.service';

describe('VibeIngestionService', () => {
  function createService() {
    const upsertCalls: unknown[] = [];
    const upsert = (input: unknown): Promise<Record<string, never>> => {
      upsertCalls.push(input);
      return Promise.resolve({});
    };
    const deleteMany = (): Promise<{ count: number }> =>
      Promise.resolve({ count: 0 });
    const prisma = {
      $transaction: (callback: (tx: unknown) => Promise<void>): Promise<void> =>
        callback({
          vibeItem: {
            upsert,
            deleteMany,
          },
        }),
    };

    return {
      upsertCalls,
      service: new VibeIngestionService(prisma as unknown as PrismaService),
    };
  }

  const validItem = {
    category: 'music',
    source: 'spotify',
    sourceItemId: 'track-1',
    name: 'Track',
    weight: 0.8,
    metadata: { rating: 9, accessToken: 'should-not-persist' },
  };

  it('rejects items from another source', async () => {
    const { service, upsertCalls } = createService();
    await expect(
      service.ingest('user_1', 'spotify', [{ ...validItem, source: 'steam' }]),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(upsertCalls).toHaveLength(0);
  });

  it('upserts normalized items and strips secrets from metadata', async () => {
    const { service, upsertCalls } = createService();
    await expect(
      service.ingest('user_1', 'spotify', [validItem]),
    ).resolves.toEqual({
      upserted: 1,
    });

    const metadata = readUpsertMetadata(upsertCalls[0]);
    expect(JSON.stringify(metadata)).not.toContain('should-not-persist');
    expect(metadata).toEqual({ rating: 9 });
  });
});

function readUpsertMetadata(call: unknown): unknown {
  if (!call || typeof call !== 'object' || !('create' in call)) {
    throw new Error('Expected an upsert call');
  }
  const create = call.create;
  if (!create || typeof create !== 'object' || !('metadata' in create)) {
    throw new Error('Expected upsert metadata');
  }
  return create.metadata;
}
