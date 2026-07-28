"use client";

import React, { useMemo } from "react";
import { Search as SearchIcon } from "lucide-react";
import CustomForm from "@/shared/components/form/CustomForm";
import searchRestaurantFormFields from "../constants/restaurant-search-form-field";
import { FormFieldType } from "@/shared/types/form-field-types";
import { Button } from "@heroui/react/button";

interface SearchProps {
	className?: string;
	values?: Partial<Record<string, any>>;
	onValuesChange?: (values: Partial<Record<string, any>>) => void;
	onSubmit?: () => void;
}

const Search: React.FC<SearchProps> = ({
	className,
	values,
	onValuesChange,
	onSubmit,
}) => {
	const defaultValues = useMemo(() => {
		const defaults: Record<string, any> = {};
		searchRestaurantFormFields.forEach((f) => {
			if (f.type === FormFieldType.DATETIME) {
				defaults["date"] = f.defaultDate ?? "";
				defaults["time"] = f.defaultTime ?? "";
			} else {
				defaults[f.name] = f.defaultValue ?? "";
			}
		});
		return defaults;
	}, []);

	return (
		<div className={className ?? ""}>
			<CustomForm
				fields={searchRestaurantFormFields}
				values={values ?? defaultValues}
				onValuesChange={(v) => onValuesChange?.(v)}
				onSubmit={() => onSubmit?.()}
				footer={
					<Button
						type="button"
						className="w-full h-10"
						onPress={() => onSubmit?.()}
					>
						<SearchIcon size={16} />
						Tìm kiếm
					</Button>
				}
				footerCol={3}
				renderForm={false}
			/>
		</div>
	);
};

export default Search;
