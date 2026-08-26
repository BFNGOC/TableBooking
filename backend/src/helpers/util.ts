import {
  StatisticsPeriod,
  StatisticsQueryDto,
} from '@app/modules/dashboard/dto/analytic-query.dto';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
const saltRounds = 10;

export const hashPasswordHelper = async (plainPassword: string) => {
  try {
    return await bcrypt.hash(plainPassword, saltRounds);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

export const validateMongoId = (id: string): void => {
  if (!mongoose.isValidObjectId(id)) {
    throw new BadRequestException('ID không hợp lệ');
  }
};

export const comparePasswordHelper = async (
  plainPassword: string,
  hashedPassword: string,
) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error comparing password:', error);
    throw error;
  }
};

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export const getMonthRange = (
  monthOffset = 0,
  date: Date = new Date(),
): DateRange => {
  const year = date.getFullYear();
  const month = date.getMonth() + monthOffset;

  return {
    startDate: new Date(year, month, 1),
    endDate: new Date(year, month + 1, 1),
  };
};

export const getWeekRange = (date: Date = new Date()): DateRange => {
  const day = date.getDay();

  // JS: Sunday = 0, Monday = 1, ..., Saturday = 6
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const startDate = new Date(date);
  startDate.setDate(date.getDate() + diffToMonday);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 7);

  return {
    startDate,
    endDate,
  };
};

export function getStatisticsDateRange(query: StatisticsQueryDto): DateRange {
  const now = new Date();

  switch (query.period) {
    case StatisticsPeriod.TODAY: {
      const startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);

      return {
        startDate,
        endDate,
      };
    }

    case StatisticsPeriod.SEVEN_DAYS: {
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);

      return {
        startDate,
        endDate,
      };
    }

    case StatisticsPeriod.THIRTY_DAYS: {
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);

      return {
        startDate,
        endDate,
      };
    }

    case StatisticsPeriod.THIS_MONTH: {
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);

      const endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );

      return {
        startDate,
        endDate,
      };
    }

    case StatisticsPeriod.LAST_MONTH: {
      const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59,
        999,
      );

      return {
        startDate,
        endDate,
      };
    }

    case StatisticsPeriod.YEAR: {
      const startDate = new Date(now.getFullYear(), 0, 1);

      const endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

      return {
        startDate,
        endDate,
      };
    }

    case StatisticsPeriod.CUSTOM: {
      if (!query.fromDate || !query.toDate) {
        throw new BadRequestException(
          'fromDate and toDate are required for custom period',
        );
      }

      const startDate = new Date(query.fromDate);
      const endDate = new Date(query.toDate);

      if (startDate > endDate) {
        throw new BadRequestException('fromDate must be before toDate');
      }

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      return {
        startDate,
        endDate,
      };
    }

    default:
      throw new BadRequestException('Invalid statistics period');
  }
}
