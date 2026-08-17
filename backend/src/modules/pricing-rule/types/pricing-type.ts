import { Types } from 'mongoose';
import {
  PricingRuleType,
  PricingValueType,
} from '../schemas/pricing-rule.schema';

export interface TablePricingResult {
  tableId: Types.ObjectId;
  basePrice: number;
  adjustments: PriceAdjustmentResult[];
  finalPrice: number;
}

export interface PriceAdjustmentResult {
  ruleId: Types.ObjectId;
  ruleName: string;
  type: PricingRuleType;
  value: number;
  valueType: PricingValueType;
  amount: number;
}
