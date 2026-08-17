import { Module, Res } from '@nestjs/common';
import { PricingRuleService } from './pricing-rule.service';
import { PricingRuleController } from './pricing-rule.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PricingRule, PricingRuleSchema } from './schemas/pricing-rule.schema';
import { TablesModule } from '../tables/tables.module';
import { AreasModule } from '../areas/areas.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PricingRule.name, schema: PricingRuleSchema },
    ]),
    RestaurantsModule,
    TablesModule,
    AreasModule,
  ],
  controllers: [PricingRuleController],
  providers: [PricingRuleService],
  exports: [PricingRuleService],
})
export class PricingRuleModule {}
