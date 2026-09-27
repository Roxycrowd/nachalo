import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config/app-config.module';
import { HealthModule } from './health/health.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { VibeModule } from './vibe/vibe.module';

/**
 * Implemented now: health, auth, users, vibe read model, integration contracts.
 * Planned as independent modules: match, discover, connections, qr, chat.
 */
@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    HealthModule,
    UsersModule,
    AuthModule,
    VibeModule,
    IntegrationsModule,
  ],
})
export class AppModule {}
