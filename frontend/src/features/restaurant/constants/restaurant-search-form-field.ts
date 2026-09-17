import { FormField } from "@/shared/types/form-field";
import { FormFieldType } from "@/shared/types/form-field-types";
import { GUEST_COUNT_OPTIONS } from "./restaurant-options";

export const searchRestaurantFormFields: FormField[] = [
	{
		name: "keySearch",
		type: FormFieldType.SEARCH,
		placeholder: "Địa điểm, nhà hàng...",
		col: 9,
	},
];

export default searchRestaurantFormFields;
