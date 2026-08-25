import { IsEnum, IsOptional } from 'class-validator';
import { DashboardPeriod } from '../types/dashboard-type';

export class DashboardQueryDto {
  @IsOptional()
  @IsEnum(DashboardPeriod)
  period?: DashboardPeriod = DashboardPeriod.WEEK;
}
