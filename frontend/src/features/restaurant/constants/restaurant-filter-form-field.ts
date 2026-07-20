import { FormField } from "@/shared/types/form-field";
import { FormFieldType } from "@/shared/types/form-field-types";
import { PRICE_RANGE_OPTIONS } from "./restaurant-options";

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
		options: [
			{ id: "european", text: "Món Âu" },
			{ id: "fine-dining", text: "Fine Dining" },
			{ id: "modern-vietnamese", text: "Món Việt hiện đại" },
			{ id: "seafood", text: "Hải sản" },
		],
		col: 12,
	},
	{
		label: "Đánh giá",
		name: "rating",
		type: FormFieldType.RADIO,
		options: [
			{ id: "4", text: "4 sao trở lên" },
			{ id: "5", text: "5 sao" },
		],
		col: 12,
	},
	{
		label: "Tiện ích",
		name: "amenities",
		type: FormFieldType.CHECKBOX_GROUP,
		options: [
			{ id: "private-room", text: "Phòng riêng" },
			{ id: "parking", text: "Chỗ đậu xe ô tô" },
			{ id: "free-wifi", text: "Wifi miễn phí" },
			{ id: "smoking-area", text: "Khu vực hút thuốc" },
		],
		col: 12,
	},
];

export default filterRestaurantFormFields;
