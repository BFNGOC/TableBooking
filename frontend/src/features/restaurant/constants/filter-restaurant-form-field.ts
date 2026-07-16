import { FormField } from "@/shared/types/form-field";
import { FormFieldType } from "@/shared/types/form-field-types";

export const filterRestaurantFormFields: FormField[] = [
	{
		label: "Khoảng giá",
		name: "priceRange",
		type: FormFieldType.SELECT,
		placeholder: "Chọn giá",
		options: [
			{ id: "under-500", text: "Dưới 500k" },
			{ id: "500-800", text: "500k - 800k" },
			{ id: "800-1200", text: "800k - 1200k" },
			{ id: "1200-2000", text: "1200k - 2000k" },
			{ id: "above-2000", text: "Trên 2000k" },
		],
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
