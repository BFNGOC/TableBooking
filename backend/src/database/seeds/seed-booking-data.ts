import 'dotenv/config';
import mongoose, { Types } from 'mongoose';

import { Area, AreaSchema } from '../../modules/areas/schemas/area.schema';

import {
  Table,
  TableSchema,
  TableStatus,
  DepositType,
  DepositStatus,
} from '../../modules/tables/schemas/table.schema';

import {
  TableAvailability,
  TableAvailabilitySchema,
} from '../../modules/table-availabilities/schemas/table-availability.schema';

import {
  PricingRule,
  PricingRuleSchema,
  PricingRuleType,
  PricingValueType,
  PricingApplyType,
  PricingAdjustmentType,
} from '../../modules/pricing-rule/schemas/pricing-rule.schema';

const RESTAURANT_ID = new Types.ObjectId('6a5786066c0eddeb1982a28a');

async function seed() {
  try {
    /**
     * =========================================
     * CONNECT DATABASE
     * =========================================
     */

    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);

    console.log('MongoDB connected');

    /**
     * =========================================
     * GET MODELS
     * =========================================
     */

    const AreaModel =
      mongoose.models[Area.name] || mongoose.model(Area.name, AreaSchema);

    const TableModel =
      mongoose.models[Table.name] || mongoose.model(Table.name, TableSchema);

    const TableAvailabilityModel =
      mongoose.models[TableAvailability.name] ||
      mongoose.model(TableAvailability.name, TableAvailabilitySchema);

    const PricingRuleModel =
      mongoose.models[PricingRule.name] ||
      mongoose.model(PricingRule.name, PricingRuleSchema);

    /**
     * =========================================
     * CLEAR OLD SEED DATA
     * =========================================
     *
     * Chỉ xóa dữ liệu của restaurant này.
     */

    console.log('\nClearing old seed data...');

    await PricingRuleModel.deleteMany({
      restaurantId: RESTAURANT_ID,
    });

    await TableAvailabilityModel.deleteMany({
      restaurantId: RESTAURANT_ID,
    });

    await TableModel.deleteMany({
      restaurantId: RESTAURANT_ID,
    });

    await AreaModel.deleteMany({
      restaurantId: RESTAURANT_ID,
    });

    console.log('Old seed data cleared');

    /**
     * =========================================
     * 1. CREATE AREAS
     * =========================================
     */

    console.log('\nCreating areas...');

    const areas = await AreaModel.insertMany([
      {
        restaurantId: RESTAURANT_ID,
        name: 'Tầng 1',
        description: 'Khu vực tầng 1, phù hợp cho khách đặt bàn thông thường.',
      },
      {
        restaurantId: RESTAURANT_ID,
        name: 'Phòng VIP',
        description: 'Phòng riêng dành cho khách VIP và nhóm khách đông.',
      },
      {
        restaurantId: RESTAURANT_ID,
        name: 'Sân thượng',
        description:
          'Khu vực ngoài trời trên sân thượng với không gian thoáng mát.',
      },
    ]);

    const groundFloor = areas[0];
    const vipRoom = areas[1];
    const rooftop = areas[2];

    console.log(`Created ${areas.length} areas`);

    /**
     * =========================================
     * 2. CREATE TABLES
     * =========================================
     */

    console.log('\nCreating tables...');

    const tables = await TableModel.insertMany([
      /**
       * =========================================
       * TẦNG 1
       * =========================================
       */

      {
        restaurantId: RESTAURANT_ID,
        areaId: groundFloor._id,
        tableNumber: 'A01',
        capacity: 2,
        status: TableStatus.AVAILABLE,
        description: 'Bàn 2 người gần cửa sổ',
        basePrice: 100000,
        depositAmount: 50000,
        depositType: DepositType.FIXED,
        depositStatus: DepositStatus.NOT_REQUIRED,
      },

      {
        restaurantId: RESTAURANT_ID,
        areaId: groundFloor._id,
        tableNumber: 'A02',
        capacity: 2,
        status: TableStatus.AVAILABLE,
        description: 'Bàn 2 người',
        basePrice: 100000,
        depositAmount: 50000,
        depositType: DepositType.FIXED,
        depositStatus: DepositStatus.NOT_REQUIRED,
      },

      {
        restaurantId: RESTAURANT_ID,
        areaId: groundFloor._id,
        tableNumber: 'A03',
        capacity: 4,
        status: TableStatus.AVAILABLE,
        description: 'Bàn 4 người',
        basePrice: 150000,
        depositAmount: 50000,
        depositType: DepositType.FIXED,
        depositStatus: DepositStatus.NOT_REQUIRED,
      },

      {
        restaurantId: RESTAURANT_ID,
        areaId: groundFloor._id,
        tableNumber: 'A04',
        capacity: 4,
        status: TableStatus.AVAILABLE,
        description: 'Bàn 4 người gần khu vực trung tâm',
        basePrice: 150000,
        depositAmount: 50000,
        depositType: DepositType.FIXED,
        depositStatus: DepositStatus.NOT_REQUIRED,
      },

      /**
       * =========================================
       * PHÒNG VIP
       * =========================================
       */

      {
        restaurantId: RESTAURANT_ID,
        areaId: vipRoom._id,
        tableNumber: 'VIP01',
        capacity: 6,
        status: TableStatus.AVAILABLE,
        description: 'Phòng VIP nhỏ',
        basePrice: 300000,
        depositAmount: 100000,
        depositType: DepositType.FIXED,
        depositStatus: DepositStatus.NOT_REQUIRED,
      },

      {
        restaurantId: RESTAURANT_ID,
        areaId: vipRoom._id,
        tableNumber: 'VIP02',
        capacity: 8,
        status: TableStatus.AVAILABLE,
        description: 'Phòng VIP lớn',
        basePrice: 400000,
        depositAmount: 150000,
        depositType: DepositType.FIXED,
        depositStatus: DepositStatus.NOT_REQUIRED,
      },

      {
        restaurantId: RESTAURANT_ID,
        areaId: vipRoom._id,
        tableNumber: 'VIP03',
        capacity: 10,
        status: TableStatus.AVAILABLE,
        description: 'Phòng VIP dành cho nhóm khách đông',
        basePrice: 500000,
        depositAmount: 200000,
        depositType: DepositType.FIXED,
        depositStatus: DepositStatus.NOT_REQUIRED,
      },

      /**
       * =========================================
       * SÂN THƯỢNG
       * =========================================
       */

      {
        restaurantId: RESTAURANT_ID,
        areaId: rooftop._id,
        tableNumber: 'R01',
        capacity: 2,
        status: TableStatus.AVAILABLE,
        description: 'Bàn đôi ngoài trời',
        basePrice: 200000,
        depositAmount: 50000,
        depositType: DepositType.FIXED,
        depositStatus: DepositStatus.NOT_REQUIRED,
      },

      {
        restaurantId: RESTAURANT_ID,
        areaId: rooftop._id,
        tableNumber: 'R02',
        capacity: 4,
        status: TableStatus.AVAILABLE,
        description: 'Bàn 4 người có view đẹp',
        basePrice: 250000,
        depositAmount: 50000,
        depositType: DepositType.FIXED,
        depositStatus: DepositStatus.NOT_REQUIRED,
      },

      {
        restaurantId: RESTAURANT_ID,
        areaId: rooftop._id,
        tableNumber: 'R03',
        capacity: 6,
        status: TableStatus.AVAILABLE,
        description: 'Bàn nhóm 6 người',
        basePrice: 350000,
        depositAmount: 100000,
        depositType: DepositType.FIXED,
        depositStatus: DepositStatus.NOT_REQUIRED,
      },
    ]);

    console.log(`Created ${tables.length} tables`);

    /**
     * =========================================
     * 3. CREATE TABLE AVAILABILITY
     * =========================================
     *
     * Quy ước:
     *
     * 0 = Chủ nhật
     * 1 = Thứ 2
     * 2 = Thứ 3
     * 3 = Thứ 4
     * 4 = Thứ 5
     * 5 = Thứ 6
     * 6 = Thứ 7
     */

    console.log('\nCreating table availability...');

    /**
     * =========================================
     * 3. CREATE TABLE AVAILABILITY
     * =========================================
     *
     * Quy ước:
     *
     * 0 = Chủ nhật
     * 1 = Thứ 2
     * 2 = Thứ 3
     * 3 = Thứ 4
     * 4 = Thứ 5
     * 5 = Thứ 6
     * 6 = Thứ 7
     */

    /**
     * =========================================
     * 3. CREATE TABLE AVAILABILITIES
     * =========================================
     */

    console.log('\nCreating table availabilities...');

    /**
     * =========================================
     * AVAILABILITY 1
     * TẦNG 1
     * =========================================
     */

    const groundFloorTableIds = tables
      .filter((table) => table.areaId.toString() === groundFloor._id.toString())
      .map((table) => table._id);

    await TableAvailabilityModel.create({
      restaurantId: RESTAURANT_ID,

      tableIds: groundFloorTableIds,

      weeklySlots: [
        // Thứ 2
        {
          dayOfWeek: 1,
          isActive: true,
          slots: [
            {
              startTime: '10:00',
              endTime: '22:00',
            },
          ],
        },

        // Thứ 3
        {
          dayOfWeek: 2,
          isActive: true,
          slots: [
            {
              startTime: '10:00',
              endTime: '22:00',
            },
          ],
        },

        // Thứ 4
        {
          dayOfWeek: 3,
          isActive: true,
          slots: [
            {
              startTime: '10:00',
              endTime: '22:00',
            },
          ],
        },

        // Thứ 5
        {
          dayOfWeek: 4,
          isActive: true,
          slots: [
            {
              startTime: '10:00',
              endTime: '22:00',
            },
          ],
        },

        // Thứ 6
        {
          dayOfWeek: 5,
          isActive: true,
          slots: [
            {
              startTime: '10:00',
              endTime: '23:00',
            },
          ],
        },

        // Thứ 7
        {
          dayOfWeek: 6,
          isActive: true,
          slots: [
            {
              startTime: '10:00',
              endTime: '23:00',
            },
          ],
        },

        // Chủ nhật
        {
          dayOfWeek: 0,
          isActive: true,
          slots: [
            {
              startTime: '10:00',
              endTime: '22:00',
            },
          ],
        },
      ],

      exceptions: [
        /**
         * 27/07
         * Tầng 1 nghỉ cả ngày
         */
        {
          date: new Date('2026-07-27T00:00:00.000Z'),
          reason: 'Tầng 1 bảo trì',
          isClosed: true,
          slots: [],
        },

        /**
         * 28/07
         * Chỉ mở buổi tối
         */
        {
          date: new Date('2026-07-28T00:00:00.000Z'),
          reason: 'Tầng 1 chỉ phục vụ buổi tối',
          isClosed: false,
          slots: [
            {
              startTime: '17:00',
              endTime: '22:00',
            },
          ],
        },

        /**
         * 29/07
         * Nghỉ giữa ca
         */
        {
          date: new Date('2026-07-29T00:00:00.000Z'),
          reason: 'Phục vụ theo hai ca',
          isClosed: false,
          slots: [
            {
              startTime: '10:00',
              endTime: '14:00',
            },
            {
              startTime: '17:00',
              endTime: '22:00',
            },
          ],
        },
      ],
    });

    /**
     * =========================================
     * AVAILABILITY 2
     * VIP + ROOFTOP
     * =========================================
     */

    const vipAndRooftopTableIds = tables
      .filter((table) => {
        const areaId = table.areaId.toString();

        return (
          areaId === vipRoom._id.toString() || areaId === rooftop._id.toString()
        );
      })
      .map((table) => table._id);

    await TableAvailabilityModel.create({
      restaurantId: RESTAURANT_ID,

      tableIds: vipAndRooftopTableIds,

      weeklySlots: [
        // Thứ 2
        {
          dayOfWeek: 1,
          isActive: true,
          slots: [
            {
              startTime: '11:00',
              endTime: '23:00',
            },
          ],
        },

        // Thứ 3
        {
          dayOfWeek: 2,
          isActive: true,
          slots: [
            {
              startTime: '11:00',
              endTime: '23:00',
            },
          ],
        },

        // Thứ 4
        {
          dayOfWeek: 3,
          isActive: true,
          slots: [
            {
              startTime: '11:00',
              endTime: '23:00',
            },
          ],
        },

        // Thứ 5
        {
          dayOfWeek: 4,
          isActive: true,
          slots: [
            {
              startTime: '11:00',
              endTime: '23:00',
            },
          ],
        },

        // Thứ 6
        {
          dayOfWeek: 5,
          isActive: true,
          slots: [
            {
              startTime: '11:00',
              endTime: '23:30',
            },
          ],
        },

        // Thứ 7
        {
          dayOfWeek: 6,
          isActive: true,
          slots: [
            {
              startTime: '11:00',
              endTime: '23:30',
            },
          ],
        },

        // Chủ nhật
        {
          dayOfWeek: 0,
          isActive: true,
          slots: [
            {
              startTime: '11:00',
              endTime: '23:00',
            },
          ],
        },
      ],

      exceptions: [
        /**
         * 27/07
         * VIP + Rooftop vẫn hoạt động
         */
        {
          date: new Date('2026-07-27T00:00:00.000Z'),
          reason: 'Tầng 1 bảo trì, khu vực VIP và sân thượng vẫn hoạt động',
          isClosed: false,
          slots: [
            {
              startTime: '11:00',
              endTime: '23:00',
            },
          ],
        },

        /**
         * 28/07
         * Mở muộn
         */
        {
          date: new Date('2026-07-28T00:00:00.000Z'),
          reason: 'Khu vực VIP và sân thượng mở cửa muộn',
          isClosed: false,
          slots: [
            {
              startTime: '16:00',
              endTime: '23:00',
            },
          ],
        },

        /**
         * 29/07
         * Nghỉ buổi chiều
         */
        {
          date: new Date('2026-07-29T00:00:00.000Z'),
          reason: 'Phục vụ theo hai ca',
          isClosed: false,
          slots: [
            {
              startTime: '11:00',
              endTime: '14:00',
            },
            {
              startTime: '18:00',
              endTime: '23:00',
            },
          ],
        },

        /**
         * 30/07
         * Đóng sớm
         */
        {
          date: new Date('2026-07-30T00:00:00.000Z'),
          reason: 'Khu vực VIP và sân thượng đóng cửa sớm',
          isClosed: false,
          slots: [
            {
              startTime: '11:00',
              endTime: '18:00',
            },
          ],
        },

        /**
         * 31/07
         * Nghỉ cả ngày
         */
        {
          date: new Date('2026-07-31T00:00:00.000Z'),
          reason: 'Khu vực VIP và sân thượng nghỉ riêng',
          isClosed: true,
          slots: [],
        },
      ],
    });

    console.log('Created 2 table availabilities');

    console.log(`Ground floor tables: ${groundFloorTableIds.length}`);

    console.log(`VIP + Rooftop tables: ${vipAndRooftopTableIds.length}`);

    console.log('Created table availability with weekly slots and exceptions');

    /**
     * =========================================
     * 4. CREATE PRICING RULES
     * =========================================
     */

    console.log('\nCreating pricing rules...');

    await PricingRuleModel.insertMany([
      /**
       * WEEKEND
       *
       * Thứ 7 + Chủ nhật
       * Tăng 20%
       * Áp dụng toàn bộ bàn
       */

      {
        restaurantId: RESTAURANT_ID,
        name: 'Phụ thu cuối tuần',
        type: PricingRuleType.WEEKEND,
        valueType: PricingValueType.PERCENT,
        adjustmentType: PricingAdjustmentType.INCREASE,
        applyType: PricingApplyType.ALL_TABLES,
        value: 20,
        priority: 1,
        daysOfWeek: [0, 6],
        isActive: true,
      },

      /**
       * PEAK HOUR
       *
       * 18:00 - 21:00
       * Tăng 10%
       * Áp dụng toàn bộ bàn
       */

      {
        restaurantId: RESTAURANT_ID,
        name: 'Giờ cao điểm buổi tối',
        type: PricingRuleType.PEAK_HOUR,
        valueType: PricingValueType.PERCENT,
        adjustmentType: PricingAdjustmentType.INCREASE,
        applyType: PricingApplyType.ALL_TABLES,
        value: 10,
        priority: 2,
        startTime: '18:00',
        endTime: '21:00',
        isActive: true,
      },

      /**
       * HAPPY HOUR
       *
       * 14:00 - 17:00
       * Giảm 10%
       * Áp dụng toàn bộ bàn
       */

      {
        restaurantId: RESTAURANT_ID,
        name: 'Happy Hour',
        type: PricingRuleType.HAPPY_HOUR,
        valueType: PricingValueType.PERCENT,
        adjustmentType: PricingAdjustmentType.DECREASE,
        applyType: PricingApplyType.ALL_TABLES,
        value: 10,
        priority: 3,
        startTime: '14:00',
        endTime: '17:00',
        isActive: true,
      },

      /**
       * VIP WEEKEND
       *
       * Cuối tuần
       * Phòng VIP
       * Tăng cố định 100000
       */

      {
        restaurantId: RESTAURANT_ID,
        name: 'Phụ thu phòng VIP cuối tuần',
        type: PricingRuleType.WEEKEND,
        valueType: PricingValueType.FIXED,
        adjustmentType: PricingAdjustmentType.INCREASE,
        applyType: PricingApplyType.AREA,
        areaIds: [vipRoom._id],
        value: 100000,
        priority: 4,
        daysOfWeek: [0, 6],
        isActive: true,
      },

      /**
       * ROOFTOP
       *
       * Phụ thu sân thượng
       * Tăng cố định 50000
       */

      {
        restaurantId: RESTAURANT_ID,
        name: 'Phụ thu sân thượng',
        type: PricingRuleType.CUSTOM,
        valueType: PricingValueType.FIXED,
        adjustmentType: PricingAdjustmentType.INCREASE,
        applyType: PricingApplyType.AREA,
        areaIds: [rooftop._id],
        value: 50000,
        priority: 5,
        isActive: true,
      },
    ]);

    console.log('Created 5 pricing rules');

    /**
     * =========================================
     * DONE
     * =========================================
     */

    console.log('\n=================================');
    console.log('SEED COMPLETED SUCCESSFULLY');
    console.log('=================================');

    console.log('\nRestaurant ID:', RESTAURANT_ID.toString());

    console.log('\nAreas:');

    areas.forEach((area) => {
      console.log(`- ${area.name}: ${area._id}`);
    });

    console.log('\nTables:');

    tables.forEach((table) => {
      console.log(
        `- ${table.tableNumber} | capacity: ${table.capacity} | id: ${table._id}`,
      );
    });

    console.log('\nPricing Rules:');

    console.log('- Weekend +20%');
    console.log('- Peak Hour +10%');
    console.log('- Happy Hour -10%');
    console.log('- VIP Weekend +100000');
    console.log('- Rooftop +50000');
  } catch (error) {
    console.error('\nSEED FAILED:', error);

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();

    console.log('\nMongoDB disconnected');
  }
}

seed();
