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
