"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Users, Search as SearchIcon } from "lucide-react";
import CustomForm from "@/shared/components/form/CustomForm";
import searchRestaurantFormFields from "../constants/search-restaurant-form-field";
import { FormFieldType } from "@/shared/types/form-field-types";

const Search: React.FC = () => {
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
		<div className="w-full max-w-4xl mx-auto">
			<div className="bg-white/70 md:bg-[#f5efeb]/80 backdrop-blur-md border border-[#e3d9d3] rounded-3xl md:rounded-full p-2 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-[#d2c3b9]">
				<div className="px-2 py-1 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
					<CustomForm
						fields={searchRestaurantFormFields}
						values={values}
						onValuesChange={(v) => setValues(v)}
						onSubmit={handleSubmit}
					/>
					<button
						type="submit"
						className="w-full max-w-[160px] bg-[#543d31] hover:bg-[#3d2a21] text-white font-semibold text-sm px-6 py-4 rounded-2xl md:rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98 cursor-pointer"
					>
						<SearchIcon size={16} />
						Tìm kiếm
					</button>
				</div>
			</div>
		</div>
	);
};

export default Search;
