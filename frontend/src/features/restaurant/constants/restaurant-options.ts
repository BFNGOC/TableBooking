import {
	RestaurantStatus,
	RestaurantVerifyStatus,
} from "../types/restaurant.type";

export const RESTAURANT_VERIFY_STATUS_OPTIONS: {
	id: RestaurantVerifyStatus;
	text: string;
}[] = [
	{ id: RestaurantVerifyStatus.EMAIL_PENDING, text: "Xác thực email" },
	{ id: RestaurantVerifyStatus.PENDING, text: "Chờ kích hoạt" },
	{ id: RestaurantVerifyStatus.APPROVED, text: "Thành công" },
	{ id: RestaurantVerifyStatus.REJECTED, text: "Thất bại" },
];

export const RESTAURANT_STATUS_OPTIONS: {
	id: RestaurantStatus;
	text: string;
}[] = [
	{ id: RestaurantStatus.ACTIVE, text: "Đang hoạt động" },
	{ id: RestaurantStatus.INACTIVE, text: "Không hoạt động" },
];

export const PRICE_RANGE_OPTIONS: {
	id: string;
	text: string;
	minPrice?: number;
	maxPrice?: number;
}[] = [
	{
		id: "under-500",
		text: "Dưới 500.000đ",
		maxPrice: 500000,
	},
	{
		id: "500-800",
		text: "500.000đ - 800.000đ",
		minPrice: 500000,
		maxPrice: 800000,
	},
	{
		id: "800-1200",
		text: "800.000đ - 1.200.000đ",
		minPrice: 800000,
		maxPrice: 1200000,
	},
	{
		id: "1200-2000",
		text: "1.200.000đ - 2.000.000đ",
		minPrice: 1200000,
		maxPrice: 2000000,
	},
	{
		id: "above-2000",
		text: "Trên 2.000.000",
		minPrice: 2000000,
	},
];

export const GUEST_COUNT_OPTIONS: {
	id: string;
	text: string;
	capacity: number;
}[] = [
	{
		id: "1",
		text: "1 người",
		capacity: 1,
	},
	{
		id: "2",
		text: "2 người",
		capacity: 2,
	},
	{
		id: "3",
		text: "3 người",
		capacity: 3,
	},
	{
		id: "4",
		text: "4 người",
		capacity: 4,
	},
	{
		id: "5",
		text: "5 người",
		capacity: 5,
	},
	{
		id: "6",
		text: "6 người",
		capacity: 6,
	},
	{
		id: "7-10",
		text: "7 - 10 người",
		capacity: 7, // tối thiểu 7 người
	},
	{
		id: "10+",
		text: "10+ người",
		capacity: 10,
	},
];

export const SORT_OPTIONS: {
	id: string;
	text: string;
}[] = [
	{
		id: "rating_desc",
		text: "Đánh giá cao nhất",
	},
	{
		id: "price_asc",
		text: "Giá từ thấp đến cao",
	},
	{
		id: "price_desc",
		text: "Giá từ cao đến thấp",
	},
];

export const CUISINE_OPTIONS: {
	id: string;
	text: string;
}[] = [
	{ id: "european", text: "Món Âu" },
	{ id: "fine-dining", text: "Fine Dining" },
	{ id: "modern-vietnamese", text: "Món Việt hiện đại" },
	{ id: "Hải sản", text: "Hải sản" },
];

export const RATING_OPTIONS: {
	id: string;
	text: string;
}[] = [
	{ id: "4", text: "4 sao trở lên" },
	{ id: "5", text: "5 sao" },
];

export const AMENITIES_OPTIONS: {
	id: string;
	text: string;
}[] = [
	{ id: "private-room", text: "Phòng riêng" },
	{ id: "parking", text: "Chỗ đậu xe ô tô" },
	{ id: "free-wifi", text: "Wifi miễn phí" },
	{ id: "smoking-area", text: "Khu vực hút thuốc" },
];
