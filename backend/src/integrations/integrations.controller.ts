import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../common/types/authenticated-user';
import { IntegrationsService } from './integrations.service';

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrations: IntegrationsService) {}

  @Get('providers')
  providers() {
    return this.integrations.listProviders();
  }

  @Get('accounts')
  @UseGuards(JwtAuthGuard)
  accounts(@CurrentUser() user: AuthenticatedUser) {
    return this.integrations.listAccounts(user.id);
  }

  @Post(':provider/sync')
  @UseGuards(JwtAuthGuard)
  sync(
    @CurrentUser() user: AuthenticatedUser,
    @Param('provider') provider: string,
  ) {
    return this.integrations.sync(user.id, provider);
  }
}
