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
