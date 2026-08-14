import {
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { RedisService } from '@app/shared/redis/redis.service';
import { getBookingHoldKey } from '@app/helpers/redis/booking-hold-key.util';

@Injectable()
export class BookingLockService {
  private readonly logger = new Logger(BookingLockService.name);

  constructor(private readonly redisService: RedisService) {}

  async releaseBookingTableLocks(keys: string[]): Promise<void> {
    if (keys.length === 0) {
      return;
    }

    await Promise.all(
      keys.map((key) =>
        this.redisService.delete(key).catch((err) => {
          this.logger.warn(`Failed to delete lock key ${key}: ${err}`);
        }),
      ),
    );
  }

  async acquireBookingTableLocks(
    restaurantId: string,
    tableIds: string[],
    bookingDate: Date,
    startTime: string,
    endTime: string,
    bookingId: string,
    ttlSeconds: number,
  ): Promise<string[]> {
    const acquiredKeys: string[] = [];

    try {
      for (const tableId of tableIds) {
        const key = getBookingHoldKey(
          restaurantId,
          tableId,
          bookingDate,
          startTime,
          endTime,
        );

        const result = await this.redisService.setIfNotExists(
          key,
          bookingId,
          ttlSeconds,
        );

        if (!result) {
          throw new ConflictException(
            `Bàn ${tableId} đang được giữ bởi một lượt đặt bàn khác`,
          );
        }

        acquiredKeys.push(key);
      }

      return acquiredKeys;
    } catch (error) {
      await this.releaseBookingTableLocks(acquiredKeys);
      throw error;
    }
  }

  async getRedisHeldTableIds(
    restaurantId: string,
    tableIds: Types.ObjectId[],
    bookingDate: Date,
    startTime: string,
    endTime: string,
  ): Promise<Set<string>> {
    const heldTableIds = new Set<string>();

    for (const tableId of tableIds) {
      const holdKey = getBookingHoldKey(
        restaurantId,
        tableId.toString(),
        bookingDate,
        startTime,
        endTime,
      );

      const exists = await this.redisService.get(holdKey);
      if (exists) {
        heldTableIds.add(tableId.toString());
      }
    }

    return heldTableIds;
  }
}
