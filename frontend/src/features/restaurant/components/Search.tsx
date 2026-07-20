"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import CustomForm from "@/shared/components/form/CustomForm";
import searchRestaurantFormFields from "../constants/restaurant-search-form-field";
import { FormFieldType } from "@/shared/types/form-field-types";
import { Button } from "@heroui/react/button";

interface SearchProps {
	className?: string;
}

const Search: React.FC<SearchProps> = ({ className }) => {
	const router = useRouter();

	const initialValues = useMemo(() => {
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

	const [values, setValues] =
		useState<Partial<Record<string, any>>>(initialValues);

	const handleSubmit = (formValues: Partial<Record<string, any>>) => {
		const searchParams = new URLSearchParams();
		const q = formValues.q ?? "";
		const date = formValues.date ?? "";
		const time = formValues.time ?? "";
		const guests = formValues.guests ?? "";

		console.log("Search form submitted with values:", {
			q,
			date,
			time,
			guests,
		});

		if (q) searchParams.set("q", q);

		// combine date and time when both present
		if (date && time) {
			searchParams.set("date", `${date}T${time}`);
		} else if (date) {
			searchParams.set("date", date);
		}

		if (guests) searchParams.set("guests", guests);

		router.push(`/restaurants?${searchParams.toString()}`);
	};

	return (
		<div className={className ?? ""}>
			<CustomForm
				fields={searchRestaurantFormFields}
				values={values}
				onValuesChange={(v) => setValues(v)}
				onSubmit={handleSubmit}
				footer={
					<Button type="submit" className="w-full h-10">
						<SearchIcon size={16} />
						Tìm kiếm
					</Button>
				}
				footerCol={2}
			/>
		</div>
	);
};

export default Search;
