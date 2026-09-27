import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../common/types/authenticated-user';
import { VibeService } from './vibe.service';

@Controller('vibe')
@UseGuards(JwtAuthGuard)
export class VibeController {
  constructor(private readonly vibe: VibeService) {}

  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.vibe.listForUser(user.id);
  }
}
