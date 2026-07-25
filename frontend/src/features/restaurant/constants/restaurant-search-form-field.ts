import { FormField } from "@/shared/types/form-field";
import { FormFieldType } from "@/shared/types/form-field-types";
import { GUEST_COUNT_OPTIONS } from "./restaurant-options";

export const searchRestaurantFormFields: FormField[] = [
	{
		name: "q",
		type: FormFieldType.SEARCH,
		placeholder: "Địa điểm, nhà hàng...",
		col: 4,
	},
	{
		name: "date",
		type: FormFieldType.DATE,
		col: 2,
	},
	{
		name: "time",
		type: FormFieldType.TIME,
		col: 2,
	},
	{
		name: "guests",
		type: FormFieldType.SELECT,
		options: GUEST_COUNT_OPTIONS,
		selectionMode: "single",
		defaultValue: "2",
		col: 2,
	},
];

export default searchRestaurantFormFields;
