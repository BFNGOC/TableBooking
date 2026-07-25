import { FormField } from "@/shared/types/form-field";
import { FormFieldType } from "@/shared/types/form-field-types";
import { SORT_OPTIONS } from "./restaurant-options";

export const selectRestaurantFormFields: FormField[] = [
	{
		name: "sortBy",
		type: FormFieldType.SELECT,
		options: [{ id: "default", text: "Phù hợp nhất" }, ...SORT_OPTIONS],
		col: 4,
	},
];

export default selectRestaurantFormFields;
