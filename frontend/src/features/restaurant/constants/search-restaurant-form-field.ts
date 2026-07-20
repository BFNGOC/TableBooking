import { FormField } from "@/shared/types/form-field";
import { FormFieldType } from "@/shared/types/form-field-types";

export const GUEST_COUNT_OPTIONS: {
	id: string;
	text: string;
}[] = [
	{ id: "1", text: "1 người" },
	{ id: "2", text: "2 người" },
	{ id: "3", text: "3 người" },
	{ id: "4", text: "4 người" },
	{ id: "5", text: "5 người" },
	{ id: "6", text: "6 người" },
	{ id: "7-10", text: "7-10 người" },
	{ id: "10+", text: "10+ người" },
];

export const searchRestaurantFormFields: FormField[] = [
	{
		name: "q",
		type: FormFieldType.TEXT,
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
