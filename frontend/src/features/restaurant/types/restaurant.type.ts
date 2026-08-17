import { ImageType } from "@/features/upload/types/image";

export enum RestaurantStatus {
	ACTIVE = "ACTIVE",
	INACTIVE = "INACTIVE",
}

export enum RestaurantVerifyStatus {
	EMAIL_PENDING = "EMAIL_PENDING",
	PENDING = "PENDING",
	APPROVED = "APPROVED",
	REJECTED = "REJECTED",
}

export enum SocialLinkType {
	FACEBOOK = "FACEBOOK",
	INSTAGRAM = "INSTAGRAM",
	TIKTOK = "TIKTOK",
	WEBSITE = "WEBSITE",
}

export interface RestaurantSocialLink {
	type: SocialLinkType;
	url: string;
}

export interface IRestaurant {
	_id?: string;

	restaurantCode?: string;
	restaurantName: string;
	description?: string;
	rating?: number;

	phone?: string;
	email?: string;
	address?: string;
	representativeName?: string;
	cuisineTypes?: string[];
	taxCode?: string;

	priceFrom?: number;
	priceTo?: number;
	capacity?: number;
	socialLinks?: RestaurantSocialLink[];

	openingTime?: string;
	closingTime?: string;

	avatar?: ImageType | null;
	images?: ImageType[];

	verifyStatus?: RestaurantVerifyStatus;
	verifyNote?: string;
	status?: RestaurantStatus;

	onboardingRequestedAt?: Date;

	isAcceptingBookings?: boolean;

	minBookingNoticeMinutes?: number;

	tableHoldMinutes?: number;

	advanceBookingDays?: number;

	userId?: string;

	slug?: string;

	verificationCodeId?: string;

	verificationCodeExpires?: Date;

	createdAt?: string | Date;
	updatedAt?: string | Date;
}
