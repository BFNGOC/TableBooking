import { FormField } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';
import { FormSection } from '@/shared/components/modals/ModalFormTabs';
import {
    PricingAdjustmentType,
    PricingApplyType,
    PricingRuleType,
    PricingValueType,
} from '../types/pricing-rule.type';

// ── Labels ────────────────────────────────────────────────────────────────────

export const RULE_TYPE_LABELS: Record<PricingRuleType, string> = {
    [PricingRuleType.HOLIDAY]: 'Ngày lễ',
    [PricingRuleType.WEEKEND]: 'Cuối tuần',
    [PricingRuleType.HAPPY_HOUR]: 'Happy Hour',
    [PricingRuleType.PEAK_HOUR]: 'Giờ cao điểm',
    [PricingRuleType.CUSTOM]: 'Tùy chỉnh',
};

export const APPLY_TYPE_LABELS: Record<PricingApplyType, string> = {
    [PricingApplyType.ALL_TABLES]: 'Tất cả bàn',
    [PricingApplyType.AREA]: 'Theo khu vực',
    [PricingApplyType.TABLE]: 'Theo bàn cụ thể',
};

export const VALUE_TYPE_LABELS: Record<PricingValueType, string> = {
    [PricingValueType.PERCENT]: 'Phần trăm (%)',
    [PricingValueType.FIXED]: 'Số tiền cố định (VND)',
};

export const ADJUSTMENT_TYPE_LABELS: Record<PricingAdjustmentType, string> = {
    [PricingAdjustmentType.INCREASE]: 'Tăng giá',
    [PricingAdjustmentType.DECREASE]: 'Giảm giá',
};

export const DAY_OF_WEEK_OPTIONS = [
    { id: 1, text: 'Thứ Hai' },
    { id: 2, text: 'Thứ Ba' },
    { id: 3, text: 'Thứ Tư' },
    { id: 4, text: 'Thứ Năm' },
    { id: 5, text: 'Thứ Sáu' },
    { id: 6, text: 'Thứ Bảy' },
    { id: 0, text: 'Chủ Nhật' },
];

// ── Section 1: Basic info ─────────────────────────────────────────────────────

export const PRICING_RULE_BASIC_FIELDS: FormField[] = [
    {
        name: 'name',
        label: 'Tên quy tắc',
        type: FormFieldType.TEXT,
        placeholder: 'VD: Phụ thu cuối tuần',
        isRequired: true,
        col: 12,
    },
    {
        name: 'type',
        label: 'Loại quy tắc',
        type: FormFieldType.SELECT,
        isRequired: true,
        col: 6,
        options: Object.values(PricingRuleType).map((v) => ({
            id: v,
            text: RULE_TYPE_LABELS[v],
        })),
    },
    {
        name: 'adjustmentType',
        label: 'Hướng điều chỉnh',
        type: FormFieldType.SELECT,
        isRequired: true,
        col: 6,
        options: Object.values(PricingAdjustmentType).map((v) => ({
            id: v,
            text: ADJUSTMENT_TYPE_LABELS[v],
        })),
    },
    {
        name: 'valueType',
        label: 'Kiểu giá trị',
        type: FormFieldType.SELECT,
        isRequired: true,
        col: 6,
        options: Object.values(PricingValueType).map((v) => ({
            id: v,
            text: VALUE_TYPE_LABELS[v],
        })),
    },
    {
        name: 'value',
        label: 'Giá trị',
        type: FormFieldType.NUMBER,
        placeholder: 'VD: 10',
        isRequired: true,
        col: 6,
    },
    {
        name: 'priority',
        label: 'Ưu tiên (số lớn áp dụng trước)',
        type: FormFieldType.NUMBER,
        placeholder: '0',
        col: 6,
    },
    {
        name: 'isActive',
        label: 'Trạng thái',
        type: FormFieldType.RADIO,
        isRequired: true,
        col: 6,
        options: [
            { id: true, text: 'Đang hoạt động' },
            { id: false, text: 'Tắt' },
        ],
    },
];

// ── Section 2: Conditions ─────────────────────────────────────────────────────

export const PRICING_RULE_CONDITION_FIELDS: FormField[] = [
    {
        name: 'applyType',
        label: 'Phạm vi áp dụng',
        type: FormFieldType.SELECT,
        isRequired: true,
        col: 12,
        options: Object.values(PricingApplyType).map((v) => ({
            id: v,
            text: APPLY_TYPE_LABELS[v],
        })),
    },
    {
        name: 'startDate',
        label: 'Ngày bắt đầu',
        type: FormFieldType.DATE_PICKER,
        col: 6,
    },
    {
        name: 'endDate',
        label: 'Ngày kết thúc',
        type: FormFieldType.DATE_PICKER,
        col: 6,
    },
    {
        name: 'startTime',
        label: 'Giờ bắt đầu',
        type: FormFieldType.TIME_PICKER,
        col: 6,
    },
    {
        name: 'endTime',
        label: 'Giờ kết thúc',
        type: FormFieldType.TIME_PICKER,
        col: 6,
    },
    {
        name: 'daysOfWeek',
        label: 'Ngày trong tuần',
        type: FormFieldType.CHECKBOX_GROUP,
        col: 12,
        options: DAY_OF_WEEK_OPTIONS,
    },
];

// ── Form sections for ModalFormTabs ──────────────────────────────────────────

export const PRICING_RULE_FORM_SECTIONS: FormSection[] = [
    {
        key: 'basic',
        title: 'Cấu hình',
        fields: PRICING_RULE_BASIC_FIELDS,
    },
    {
        key: 'conditions',
        title: 'Điều kiện áp dụng',
        fields: PRICING_RULE_CONDITION_FIELDS,
    },
];
