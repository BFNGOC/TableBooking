import { Module } from '@nestjs/common';
import { PricingRuleService } from './pricing-rule.service';
import { PricingRuleController } from './pricing-rule.controller';

@Module({
  controllers: [PricingRuleController],
  providers: [PricingRuleService],
  exports: [PricingRuleService],
})
export class PricingRuleModule {}
