import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<{
    status: 'ok';
    service: 'vibe-api';
    database: 'up';
  }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException('База данных недоступна');
    }

    return { status: 'ok', service: 'vibe-api', database: 'up' };
  }
}
