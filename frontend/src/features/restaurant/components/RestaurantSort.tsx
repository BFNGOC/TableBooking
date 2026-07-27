"use client";

import { useEffect, useState } from "react";
import CustomForm from "@/shared/components/form/CustomForm";
import selectRestaurantFormFields from "../constants/restaurant-sort-form-field";

interface RestaurantSortProps {
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
}

const RestaurantSort: React.FC<RestaurantSortProps> = ({
	value = "default",
	onChange,
	className,
}) => {
	const [values, setValues] = useState<Partial<Record<string, any>>>({
		sort: value,
	});

	useEffect(() => {
		setValues((prev) => (prev.sort === value ? prev : { sort: value }));
	}, [value]);

	const handleValuesChange = (nextValues: Partial<Record<string, any>>) => {
		const nextValue = nextValues.sort ?? value;
		setValues(nextValues);
		onChange?.(String(nextValue));
	};

	return (
		<div className={className ?? "w-full sm:w-auto"}>
			<CustomForm
				fields={selectRestaurantFormFields.map((field) => ({
					...field,
					col: 4,
				}))}
				values={values}
				onValuesChange={handleValuesChange}
				renderForm={false}
			/>
		</div>
	);
};

export default RestaurantSort;
