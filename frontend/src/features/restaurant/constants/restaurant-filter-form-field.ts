import { FormField } from "@/shared/types/form-field";
import { FormFieldType } from "@/shared/types/form-field-types";
import {
	PRICE_RANGE_OPTIONS,
	CUISINE_OPTIONS,
	RATING_OPTIONS,
	AMENITIES_OPTIONS,
} from "./restaurant-options";

export const filterRestaurantFormFields: FormField[] = [
	{
		label: "Khoảng giá",
		name: "priceRange",
		type: FormFieldType.SELECT,
		placeholder: "Chọn giá",
		options: PRICE_RANGE_OPTIONS,
		col: 12,
	},
	{
		label: "Loại món ăn",
		name: "cuisineTypes",
		type: FormFieldType.CHECKBOX,
		options: CUISINE_OPTIONS,
		col: 12,
	},
	{
		label: "Đánh giá",
		name: "minRating",
		type: FormFieldType.RADIO,
		options: RATING_OPTIONS,
		col: 12,
	},
];

export default filterRestaurantFormFields;
