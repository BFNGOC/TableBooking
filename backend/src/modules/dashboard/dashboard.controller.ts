import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CurrentUser } from '@app/decorator/current-user.decorator';
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
import { StatisticsService } from './statistics.service';
import { StatisticsQueryDto } from './dto/analytic-query.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly statisticsService: StatisticsService,
  ) {}

  @Get()
  async getDashboardData(
    @CurrentUser() user: AuthUser,
    @Query() query: DashboardQueryDto,
  ) {
    return this.dashboardService.getDashboardData(user._id, query.period);
  }

  @Get('analytic')
  async getStatistics(
    @CurrentUser() user: AuthUser,
    @Query() query: StatisticsQueryDto,
  ) {
    return this.statisticsService.getStatistics(user._id, query);
  }
}
