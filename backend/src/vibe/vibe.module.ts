import { Module } from '@nestjs/common';
import { SessionModule } from '../auth/session.module';
import { VibeController } from './vibe.controller';
import { VibeService } from './vibe.service';

@Module({
  imports: [SessionModule],
  controllers: [VibeController],
  providers: [VibeService],
})
export class VibeModule {}
