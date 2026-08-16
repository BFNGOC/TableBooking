import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PricingRuleService } from './pricing-rule.service';
import { Public } from '@app/decorator/customize';
import { PreviewBookingPricingDto } from './dto/preview-booking-pricing.dto';
import { CreatePricingRuleDto } from './dto/create-pricing-rule.dto';
import { UpdatePricingRuleDto } from './dto/update-pricing-rule.dto';
import { FindPricingRulesDto } from './dto/find-pricing-rules.dto';
import { CurrentUser } from '@app/decorator/current-user.decorator';
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';
import { Roles } from '@app/decorator/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('pricing-rule')
export class PricingRuleController {
  constructor(private readonly pricingRuleService: PricingRuleService) {}

  @Get('restaurant/my')
  @Roles(UserRole.RESTAURANT)
  findAllByRestaurant(
    @Query() query: FindPricingRulesDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.pricingRuleService.findAllByRestaurant(user._id, query);
  }

  @Get('restaurant/:pricingRuleId')
  @Roles(UserRole.RESTAURANT)
  findOneByRestaurant(
    @Param('pricingRuleId') pricingRuleId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.pricingRuleService.findOneByRestaurant(pricingRuleId, user._id);
  }

  @Post('restaurant')
  @Roles(UserRole.RESTAURANT)
  create(
    @Body() createPricingRuleDto: CreatePricingRuleDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.pricingRuleService.create(createPricingRuleDto, user._id);
  }

  @Patch('restaurant/:pricingRuleId')
  @Roles(UserRole.RESTAURANT)
  update(
    @Param('pricingRuleId') pricingRuleId: string,
    @Body() updatePricingRuleDto: UpdatePricingRuleDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.pricingRuleService.update(
      pricingRuleId,
      updatePricingRuleDto,
      user._id,
    );
  }

  @Delete('restaurant/:pricingRuleId')
  @Roles(UserRole.RESTAURANT)
  remove(
    @Param('pricingRuleId') pricingRuleId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.pricingRuleService.remove(pricingRuleId, user._id);
  }

  @Post(':restaurantId/pricing-preview')
  @Public()
  async previewBookingPricing(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: PreviewBookingPricingDto,
  ) {
    return this.pricingRuleService.previewBookingPricing(restaurantId, dto);
  }
}
