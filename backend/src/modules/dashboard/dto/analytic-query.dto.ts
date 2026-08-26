import { IsDateString, IsEnum, IsOptional, ValidateIf } from 'class-validator';

export enum StatisticsPeriod {
  TODAY = 'today',
  SEVEN_DAYS = '7d',
  THIRTY_DAYS = '30d',
  THIS_MONTH = 'thisMonth',
  LAST_MONTH = 'lastMonth',
  YEAR = 'year',
  CUSTOM = 'custom',
}

export class StatisticsQueryDto {
  @IsOptional()
  @IsEnum(StatisticsPeriod)
  period: StatisticsPeriod = StatisticsPeriod.SEVEN_DAYS;

  @ValidateIf((o) => o.period === StatisticsPeriod.CUSTOM)
  @IsDateString()
  fromDate?: string;

  @ValidateIf((o) => o.period === StatisticsPeriod.CUSTOM)
  @IsDateString()
  toDate?: string;
}
