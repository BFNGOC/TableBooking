import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PricingRuleService } from './pricing-rule.service';
import { Public } from '@app/decorator/customize';
import { PreviewBookingPricingDto } from './dto/preview-booking-pricing.dto';

@Controller('pricing-rule')
export class PricingRuleController {
  constructor(private readonly pricingRuleService: PricingRuleService) {}

  @Post(':restaurantId/pricing-preview')
  @Public()
  async previewBookingPricing(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: PreviewBookingPricingDto,
  ) {
    return this.pricingRuleService.previewBookingPricing(restaurantId, dto);
  }
}
