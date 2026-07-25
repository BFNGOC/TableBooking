"use client";

import { Button } from "@heroui/react";
import { RotateCcw } from "lucide-react";
import CustomForm from "@/shared/components/form/CustomForm";
import filterRestaurantFormFields from "../constants/restaurant-filter-form-field";
import { FormFieldType } from "@/shared/types/form-field-types";

interface FilterBarProps {
	values?: Partial<Record<string, any>>;
	onValuesChange?: (values: Partial<Record<string, any>>) => void;
	onSubmit?: () => void;
	onReset?: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
	values = {},
	onValuesChange,
	onSubmit,
	onReset,
}) => {
	const resetFilters = () => {
		const empty: Partial<Record<string, any>> = {};

		filterRestaurantFormFields.forEach((f) => {
			if (
				f.type === FormFieldType.CHECKBOX_GROUP ||
				f.type === FormFieldType.CHECKBOX
			) {
				empty[f.name] = [];
			} else if (
				f.type === FormFieldType.RADIO ||
				f.type === FormFieldType.RADIO_GROUP
			) {
				empty[f.name] = undefined;
			} else {
				empty[f.name] = "";
			}
		});

		onValuesChange?.(empty);
		onReset?.();
	};

	const footer = (
		<div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
			<Button
				type="button"
				size="sm"
				variant="secondary"
				onPress={resetFilters}
			>
				Xóa tất cả
			</Button>
			<Button
				type="button"
				size="sm"
				variant="primary"
				onPress={() => onSubmit?.()}
			>
				Áp dụng
			</Button>
		</div>
	);

	return (
		<div className="w-full bg-[#fff8f5] border-r border-[#e6d8c9] p-5">
			<div className="flex items-center justify-between mb-4">
				<div>
					<div className="text-sm font-bold uppercase tracking-[0.2em] text-[#3d2a21]">
						Bộ lọc
					</div>
				</div>
				<Button
					type="button"
					size="sm"
					variant="ghost"
					onPress={resetFilters}
				>
					<RotateCcw size={16} className="mr-2" />
					Xóa tất cả
				</Button>
			</div>

			<CustomForm
				fields={filterRestaurantFormFields}
				values={values}
				onValuesChange={(nextValues) => onValuesChange?.(nextValues)}
				onSubmit={() => onSubmit?.()}
				footer={footer}
				footerClassName="mt-4"
				renderForm={false}
			/>
		</div>
	);
};

export default FilterBar;
