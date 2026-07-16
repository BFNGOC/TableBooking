"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { RotateCcw } from "lucide-react";
import CustomForm from "@/shared/components/form/CustomForm";
import filterRestaurantFormFields from "../constants/filter-restaurant-form-field";
import { FormField } from "@/shared/types/form-field";
import { FormFieldType } from "@/shared/types/form-field-types";

interface FilterBarProps {
	initialValues?: Partial<Record<string, any>>;
	onSubmit?: (values: Partial<Record<string, any>>) => void;
	onReset?: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
	initialValues = {},
	onSubmit,
	onReset,
}) => {
	const [values, setValues] =
		useState<Partial<Record<string, any>>>(initialValues);

	const resetFilters = () => {

		// If initialValues provided, reset to them; otherwise clear fields.
		if (initialValues && Object.keys(initialValues).length > 0) {
			setValues(initialValues);
			onReset?.();
			return;
		}

		const empty: Partial<Record<string, any>> = {};

		filterRestaurantFormFields.forEach((f) => {
			if (f.type === FormFieldType.CHECKBOX_GROUP || f.type === FormFieldType.CHECKBOX) {
				empty[f.name] = [];
			} else if (f.type === FormFieldType.RADIO || f.type === FormFieldType.RADIO_GROUP) {
				// set undefined so RadioCustom treats it as unselected
				empty[f.name] = undefined;
			} else {
				empty[f.name] = '';
			}
		});

		setValues(empty);
		onReset?.();
	};

	const handleSubmit = (formValues: Partial<Record<string, any>>) => {
		onSubmit?.(formValues);
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
			<Button type="submit" size="sm" variant="primary">
				Áp dụng
			</Button>
		</div>
	);

	return (
		<div className="w-full bg-[#f5efeb] border border-[#e6d8c9] p-5 shadow-sm">
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
				onValuesChange={(nextValues) => setValues(nextValues)}
				onSubmit={handleSubmit}
				footer={footer}
				footerClassName="mt-4"
			/>
		</div>
	);
};

export default FilterBar;
