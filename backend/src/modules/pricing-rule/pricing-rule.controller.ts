import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PricingRuleService } from './pricing-rule.service';
import { CreatePricingRuleDto } from './dto/create-pricing-rule.dto';
import { UpdatePricingRuleDto } from './dto/update-pricing-rule.dto';

@Controller('pricing-rule')
export class PricingRuleController {
  constructor(private readonly pricingRuleService: PricingRuleService) {}

  @Post()
  create(@Body() createPricingRuleDto: CreatePricingRuleDto) {
    return this.pricingRuleService.create(createPricingRuleDto);
  }

  @Get()
  findAll() {
    return this.pricingRuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pricingRuleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePricingRuleDto: UpdatePricingRuleDto) {
    return this.pricingRuleService.update(+id, updatePricingRuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pricingRuleService.remove(+id);
  }
}
