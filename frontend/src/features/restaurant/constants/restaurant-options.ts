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

export type RestaurantOption = {
	id: string;
	text: string;
};

export const PRICE_RANGE_OPTIONS: RestaurantOption[] = [
	{ id: "under-500", text: "Dưới 500k" },
	{ id: "500-800", text: "500k - 800k" },
	{ id: "800-1200", text: "800k - 1200k" },
	{ id: "1200-2000", text: "1200k - 2000k" },
	{ id: "above-2000", text: "Trên 2000k" },
];

export const GUEST_COUNT_OPTIONS: RestaurantOption[] = [
	{ id: "1", text: "1 người" },
	{ id: "2", text: "2 người" },
	{ id: "3", text: "3 người" },
	{ id: "4", text: "4 người" },
	{ id: "5", text: "5 người" },
	{ id: "6", text: "6 người" },
	{ id: "7-10", text: "7-10 người" },
	{ id: "10+", text: "10+ người" },
];
