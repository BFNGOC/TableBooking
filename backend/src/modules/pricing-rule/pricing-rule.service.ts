import { Injectable } from '@nestjs/common';
import { CreatePricingRuleDto } from './dto/create-pricing-rule.dto';
import { UpdatePricingRuleDto } from './dto/update-pricing-rule.dto';

@Injectable()
export class PricingRuleService {
  create(createPricingRuleDto: CreatePricingRuleDto) {
    return 'This action adds a new pricingRule';
  }

  findAll() {
    return `This action returns all pricingRule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pricingRule`;
  }

  update(id: number, updatePricingRuleDto: UpdatePricingRuleDto) {
    return `This action updates a #${id} pricingRule`;
  }

  remove(id: number) {
    return `This action removes a #${id} pricingRule`;
  }
}
