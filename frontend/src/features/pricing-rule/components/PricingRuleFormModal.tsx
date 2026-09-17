"use client";

import { useEffect, useMemo } from "react";
import ModalFormTabs, {
	FormSection,
} from "@/shared/components/modals/ModalFormTabs";
import { FormModalModeType } from "@/shared/types/form-modal-mode-type";
import { FormField } from "@/shared/types/form-field";
import { FormFieldType } from "@/shared/types/form-field-types";
import { formatSectionFormValues } from "@/shared/utils/format-section-form-values";
import { IPricingRule, PricingApplyType } from "../types/pricing-rule.type";
import {
	PRICING_RULE_BASIC_FIELDS,
	PRICING_RULE_CONDITION_FIELDS,
} from "../constants/pricing-rule-form-fields";
import {
	usePricingRuleAreaOptions,
	usePricingRuleTableOptions,
} from "../hooks/usePricingRule";

interface PricingRuleFormModalProps {
	isOpen: boolean;
	mode?: FormModalModeType;
	values: Partial<IPricingRule> | null;
	onValuesChange: (values: Partial<IPricingRule>) => void;
	onSubmit: (values: Partial<IPricingRule>) => void;
	onClose: () => void;
	isPending?: boolean;
}

export default function PricingRuleFormModal({
	isOpen,
	mode = "create",
	values,
	onValuesChange,
	onSubmit,
	onClose,
	isPending,
}: PricingRuleFormModalProps) {
	const { options: areaOptions, isLoading: areasLoading } =
		usePricingRuleAreaOptions();
	const { options: tableOptions, isLoading: tablesLoading } =
		usePricingRuleTableOptions();

	const applyType = values?.applyType ?? PricingApplyType.ALL_TABLES;

	const conditionFields: FormField[] = useMemo(() => {
		const areaField: FormField = {
			name: "areaIds",
			label: "Khu vực áp dụng",
			type: FormFieldType.SELECT,
			col: 12,
			isRequired: ({ dataForm }) =>
				dataForm.applyType === PricingApplyType.AREA,
			hidden: ({ dataForm }) =>
				dataForm.applyType !== PricingApplyType.AREA,
			isDisabled: areasLoading,
			options: areaOptions,
			selectionMode: "multiple",
		};

		const tableField: FormField = {
			name: "tableIds",
			label: "Bàn áp dụng",
			type: FormFieldType.SELECT,
			col: 12,
			isRequired: ({ dataForm }) =>
				dataForm.applyType === PricingApplyType.TABLE,
			hidden: ({ dataForm }) =>
				dataForm.applyType !== PricingApplyType.TABLE,
			isDisabled: tablesLoading,
			options: tableOptions,
			selectionMode: "multiple",
		};

		// Insert area/table fields right after applyType
		const [applyTypeField, ...rest] = PRICING_RULE_CONDITION_FIELDS;
		return [applyTypeField, areaField, tableField, ...rest];
	}, [areaOptions, tableOptions, areasLoading, tablesLoading]);

	const sections: FormSection<IPricingRule>[] = useMemo(
		() => [
			{
				key: "basic",
				title: "Cấu hình",
				fields: PRICING_RULE_BASIC_FIELDS,
			},
			{
				key: "conditions",
				title: "Điều kiện áp dụng",
				fields: conditionFields,
			},
		],
		[conditionFields],
	);

	// Format values when loading (API -> Form format)
	useEffect(() => {
		if (!isOpen || !values) return;
		const formattedValues = formatSectionFormValues(
			values,
			sections,
			"toForm",
		);
		onValuesChange(formattedValues);
	}, [isOpen, values?._id]); // Trigger only on open or when record ID changes

	// Reset areaIds/tableIds khi đổi applyType
	useEffect(() => {
		if (!values) return;
		if (applyType !== PricingApplyType.AREA) {
			onValuesChange({ ...values, areaIds: [] });
		}
		if (applyType !== PricingApplyType.TABLE) {
			onValuesChange({ ...values, tableIds: [] });
		}
	}, [applyType]);

	const handleFormSubmit = (values: Partial<IPricingRule>) => {
		// Convert Time/CalendarDate objects → API strings via shared formatSectionFormValues
		const formattedValues = formatSectionFormValues(
			values,
			sections,
			"toApi",
		) as Partial<IPricingRule>;

		// Normalize daysOfWeek: checkbox group trả về string[], cần number[]
		if (Array.isArray(formattedValues.daysOfWeek)) {
			formattedValues.daysOfWeek = formattedValues.daysOfWeek
				.map((item) => Number(item))
				.filter((item) => !Number.isNaN(item));
		}

		// Normalize isActive: RADIO trả về string "true"/"false"
		if (typeof formattedValues.isActive === "string") {
			formattedValues.isActive = formattedValues.isActive === "true";
		}

		onSubmit(formattedValues);
	};

	return (
		<ModalFormTabs<IPricingRule>
			isOpen={isOpen}
			mode={mode}
			title={({ mode }) =>
				mode === "create" ? "Tạo quy tắc giá" : "Chỉnh sửa quy tắc giá"
			}
			sections={sections}
			values={values}
			onValuesChange={onValuesChange}
			onSubmit={handleFormSubmit}
			onClose={onClose}
			isPending={isPending}
		/>
	);
}
