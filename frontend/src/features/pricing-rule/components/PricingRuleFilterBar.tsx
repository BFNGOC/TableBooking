'use client';

import { Select, ListBox, Button } from '@heroui/react';
import { PricingApplyType, PricingRuleType } from '../types/pricing-rule.type';
import { FindPricingRulesParams } from '../types/pricing-rule.dto';
import {
    APPLY_TYPE_LABELS,
    RULE_TYPE_LABELS,
} from '../constants/pricing-rule-form-fields';

interface PricingRuleFilterBarProps {
    filterValues: Partial<FindPricingRulesParams>;
    onFilterChange: (values: Partial<FindPricingRulesParams>) => void;
    onFilterSubmit: () => void;
    onFilterReset: () => void;
}

export default function PricingRuleFilterBar({
    filterValues,
    onFilterChange,
    onFilterSubmit,
    onFilterReset,
}: PricingRuleFilterBarProps) {
    return (
        <div className="flex flex-wrap items-end gap-3">
            {/* Keyword */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Tìm kiếm</label>
                <input
                    type="text"
                    placeholder="Tên quy tắc..."
                    value={filterValues.keyword ?? ''}
                    onChange={(e) => onFilterChange({ ...filterValues, keyword: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && onFilterSubmit()}
                    className="h-9 rounded-lg border border-gray-300 px-3 text-sm focus:border-[#6f4e37] focus:outline-none"
                />
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Loại quy tắc</label>
                <Select
                    placeholder="Tất cả"
                    selectedKey={filterValues.type ?? null}
                    onChange={(val) =>
                        onFilterChange({
                            ...filterValues,
                            type: (val as PricingRuleType) || undefined,
                        })
                    }
                    className="w-44"
                >
                    <Select.Trigger className="h-9">
                        <Select.Value />
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox>
                            <ListBox.Item id="" textValue="Tất cả">
                                Tất cả
                                <ListBox.ItemIndicator />
                            </ListBox.Item>
                            {Object.values(PricingRuleType).map((v) => (
                                <ListBox.Item key={v} id={v} textValue={RULE_TYPE_LABELS[v]}>
                                    {RULE_TYPE_LABELS[v]}
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                            ))}
                        </ListBox>
                    </Select.Popover>
                </Select>
            </div>

            {/* Apply Type */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Phạm vi</label>
                <Select
                    placeholder="Tất cả"
                    selectedKey={filterValues.applyType ?? null}
                    onChange={(val) =>
                        onFilterChange({
                            ...filterValues,
                            applyType: (val as PricingApplyType) || undefined,
                        })
                    }
                    className="w-44"
                >
                    <Select.Trigger className="h-9">
                        <Select.Value />
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox>
                            <ListBox.Item id="" textValue="Tất cả">
                                Tất cả
                                <ListBox.ItemIndicator />
                            </ListBox.Item>
                            {Object.values(PricingApplyType).map((v) => (
                                <ListBox.Item key={v} id={v} textValue={APPLY_TYPE_LABELS[v]}>
                                    {APPLY_TYPE_LABELS[v]}
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                            ))}
                        </ListBox>
                    </Select.Popover>
                </Select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Trạng thái</label>
                <Select
                    placeholder="Tất cả"
                    selectedKey={
                        filterValues.isActive === undefined ? null : String(filterValues.isActive)
                    }
                    onChange={(val) =>
                        onFilterChange({
                            ...filterValues,
                            isActive: val === '' ? undefined : val === 'true',
                        })
                    }
                    className="w-36"
                >
                    <Select.Trigger className="h-9">
                        <Select.Value />
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox>
                            <ListBox.Item id="" textValue="Tất cả">Tất cả<ListBox.ItemIndicator /></ListBox.Item>
                            <ListBox.Item id="true" textValue="Hoạt động">Hoạt động<ListBox.ItemIndicator /></ListBox.Item>
                            <ListBox.Item id="false" textValue="Tắt">Tắt<ListBox.ItemIndicator /></ListBox.Item>
                        </ListBox>
                    </Select.Popover>
                </Select>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <Button
                    variant="primary"
                    size="sm"
                    className="bg-[#6f4e37] text-white"
                    onPress={onFilterSubmit}
                >
                    Tìm kiếm
                </Button>
                <Button variant="outline" size="sm" onPress={onFilterReset}>
                    Đặt lại
                </Button>
            </div>
        </div>
    );
}
