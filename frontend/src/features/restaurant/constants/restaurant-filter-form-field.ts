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
		name: "cuisine",
		type: FormFieldType.RADIO,
		options: CUISINE_OPTIONS,
		col: 12,
	},
	{
		label: "Đánh giá",
		name: "rating",
		type: FormFieldType.RADIO,
		options: RATING_OPTIONS,
		col: 12,
	},
	{
		label: "Tiện ích",
		name: "amenities",
		type: FormFieldType.CHECKBOX_GROUP,
		options: AMENITIES_OPTIONS,
		col: 12,
	},
];

export default filterRestaurantFormFields;
