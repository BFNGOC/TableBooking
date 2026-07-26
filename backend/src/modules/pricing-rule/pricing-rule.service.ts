import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PricingAdjustmentType,
  PricingApplyType,
  PricingRule,
  PricingRuleDocument,
  PricingValueType,
} from './schemas/pricing-rule.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  DepositType,
  Table,
  TableDocument,
} from '../tables/schemas/table.schema';
import { DepositStatus } from '../bookings/schemas/booking.schema';
import { TablePricingResult } from './types/pricing-type';
import { PreviewBookingPricingDto } from './dto/preview-booking-pricing.dto';

@Injectable()
export class PricingRuleService {
  constructor(
    @InjectModel(PricingRule.name)
    private readonly pricingRuleModel: Model<PricingRuleDocument>,
    @InjectModel(Table.name)
    private readonly tableModel: Model<TableDocument>,
  ) {}

  async calculateBasePrice(tableIds: string[]) {
    const tableObjectIds = tableIds.map((id) => new Types.ObjectId(id));

    const tables = await this.tableModel
      .find({
        _id: {
          $in: tableObjectIds,
        },
      })
      .select('_id basePrice')
      .lean();

    if (tables.length !== tableIds.length) {
      const foundIds = new Set(tables.map((table) => table._id.toString()));

      const missingTableId = tableIds.find((id) => !foundIds.has(id));

      throw new NotFoundException(`Không có bàn id ${missingTableId}`);
    }

    const basePrice = tables.reduce(
      (sum, table) => sum + (table.basePrice ?? 0),
      0,
    );

    console.log('tables', tables);

    return basePrice;
  }

  async calculateTablePricing(
    restaurantId: string,
    tableId: string,
    bookingDate: Date,
    startTime: string,
  ): Promise<TablePricingResult> {
    if (!Types.ObjectId.isValid(restaurantId)) {
      throw new BadRequestException('Định dạng ID nhà hàng không hợp lệ');
    }

    if (!Types.ObjectId.isValid(tableId)) {
      throw new BadRequestException(
        `Định dạng ID bàn không hợp lệ: ${tableId}`,
      );
    }

    const restaurantObjectId = new Types.ObjectId(restaurantId);
    const tableObjectId = new Types.ObjectId(tableId);

    // 1. Lấy thông tin bàn
    const table = await this.tableModel
      .findOne({
        _id: tableObjectId,
        restaurantId: restaurantObjectId,
      })
      .select('_id areaId basePrice')
      .lean();

    if (!table) {
      throw new NotFoundException(`Không tìm thấy bàn ${tableId}`);
    }

    const basePrice = table.basePrice ?? 0;

    // 2. Lấy các PricingRule đang active
    const rules = await this.pricingRuleModel
      .find({
        restaurantId: restaurantObjectId,
        isActive: true,
      })
      .sort({
        priority: -1,
      })
      .lean();

    // 3. Ngày trong tuần
    const dayOfWeek = bookingDate.getDay();

    // 4. Lọc các rule áp dụng cho bàn này
    const matchedRules = rules.filter((rule) => {
      // =========================
      // CHECK DATE
      // =========================

      if (rule.startDate && bookingDate < new Date(rule.startDate)) {
        return false;
      }

      if (rule.endDate && bookingDate > new Date(rule.endDate)) {
        return false;
      }

      // =========================
      // CHECK DAY OF WEEK
      // =========================

      if (rule.daysOfWeek.length > 0 && !rule.daysOfWeek.includes(dayOfWeek)) {
        return false;
      }

      // =========================
      // CHECK START TIME
      // =========================

      if (rule.startTime && rule.endTime) {
        const isTimeMatch =
          startTime >= rule.startTime && startTime < rule.endTime;

        if (!isTimeMatch) {
          return false;
        }
      }

      // =========================
      // CHECK APPLY TYPE
      // =========================

      switch (rule.applyType) {
        // Áp dụng cho tất cả bàn
        case PricingApplyType.ALL_TABLES:
          return true;

        // Áp dụng cho bàn cụ thể
        case PricingApplyType.TABLE:
          return rule.tableIds.some(
            (ruleTableId) => ruleTableId.toString() === tableId,
          );

        // Áp dụng cho khu vực
        case PricingApplyType.AREA:
          if (!table.areaId) {
            return false;
          }

          return rule.areaIds.some(
            (ruleAreaId) => ruleAreaId.toString() === table.areaId!.toString(),
          );

        default:
          return false;
      }
    });

    // 5. Tính adjustment
    const adjustments = matchedRules.map((rule) => {
      let amount = 0;

      // FIXED
      if (rule.valueType === PricingValueType.FIXED) {
        amount = rule.value;
      }

      // PERCENT
      if (rule.valueType === PricingValueType.PERCENT) {
        amount = (basePrice * rule.value) / 100;
      }

      // DECREASE
      if (rule.adjustmentType === PricingAdjustmentType.DECREASE) {
        amount = -amount;
      }

      return {
        ruleId: rule._id,
        ruleName: rule.name,
        type: rule.type,
        value: rule.value,
        valueType: rule.valueType,
        amount,
      };
    });

    // 6. Tổng adjustment
    const totalAdjustment = adjustments.reduce(
      (total, adjustment) => total + adjustment.amount,
      0,
    );

    // 7. Giá cuối của riêng bàn
    const finalPrice = Math.max(0, basePrice + totalAdjustment);

    return {
      tableId: table._id,
      basePrice,
      adjustments,
      finalPrice,
    };
  }

  async calculateDeposit(tablePricings: TablePricingResult[]) {
    const tableIds = tablePricings.map((table) => table.tableId);

    const tables = await this.tableModel
      .find({
        _id: {
          $in: tableIds,
        },
      })
      .select('_id depositType depositAmount')
      .lean();

    if (tables.length !== tableIds.length) {
      throw new NotFoundException('Không tìm thấy một hoặc nhiều bàn');
    }

    let totalDeposit = 0;

    const tableDeposits = tablePricings.map((tablePricing) => {
      const table = tables.find(
        (item) => item._id.toString() === tablePricing.tableId.toString(),
      );

      if (!table) {
        throw new NotFoundException(`Không tìm thấy bàn`);
      }

      let depositAmount = 0;

      switch (table.depositType) {
        case DepositType.NONE:
          depositAmount = 0;
          break;

        case DepositType.FIXED:
          depositAmount = table.depositAmount ?? 0;
          break;

        case DepositType.PERCENT:
          depositAmount =
            (tablePricing.finalPrice * (table.depositAmount ?? 0)) / 100;
          break;

        default:
          throw new BadRequestException(`Loại đặt cọc của bàn không hợp lệ`);
      }

      totalDeposit += depositAmount;

      return {
        tableId: tablePricing.tableId,
        depositType: table.depositType,
        depositRate:
          table.depositType === DepositType.PERCENT
            ? table.depositAmount
            : undefined,
        depositAmount,
      };
    });

    const hasDepositRequired = tableDeposits.some(
      (table) => table.depositType !== DepositType.NONE,
    );

    return {
      depositAmount: totalDeposit,
      depositStatus: hasDepositRequired
        ? DepositStatus.PENDING
        : DepositStatus.NOT_REQUIRED,
      tableDeposits,
    };
  }

  async calculatePricing(
    restaurantId: string,
    tableIds: string[],
    bookingDate: Date,
    startTime: string,
  ) {
    if (tableIds.length === 0) {
      throw new BadRequestException('Phải chọn ít nhất một bàn');
    }

    // Phải khai báo kiểu cho mảng
    const tablePricings: TablePricingResult[] = [];

    for (const tableId of tableIds) {
      const tablePricing = await this.calculateTablePricing(
        restaurantId,
        tableId,
        bookingDate,
        startTime,
      );

      tablePricings.push(tablePricing);
    }

    // Tổng giá cơ bản
    const basePrice = tablePricings.reduce(
      (total, table) => total + table.basePrice,
      0,
    );

    // Tổng giá sau điều chỉnh
    const finalPrice = tablePricings.reduce(
      (total, table) => total + table.finalPrice,
      0,
    );

    // Gom tất cả adjustment của các bàn
    const adjustments = tablePricings.flatMap((table) => table.adjustments);

    return {
      basePrice,
      finalPrice,
      adjustments,
      tablePricings,
      calculatedAt: new Date(),
    };
  }

  async previewBookingPricing(
    restaurantId: string,
    dto: PreviewBookingPricingDto,
  ) {
    const { tableIds, bookingDate, startTime } = dto;

    const parsedBookingDate = new Date(bookingDate);

    if (isNaN(parsedBookingDate.getTime())) {
      throw new BadRequestException('Ngày đặt bàn không hợp lệ');
    }

    const pricing = await this.calculatePricing(
      restaurantId,
      tableIds,
      parsedBookingDate,
      startTime,
    );

    const deposit = await this.calculateDeposit(pricing.tablePricings);

    return {
      basePrice: pricing.basePrice,
      adjustments: pricing.adjustments,
      finalPrice: pricing.finalPrice,
      depositAmount: deposit.depositAmount,
      depositStatus: deposit.depositStatus,
      tablePricings: pricing.tablePricings,
      tableDeposits: deposit.tableDeposits,
      calculatedAt: pricing.calculatedAt,
    };
  }
}
