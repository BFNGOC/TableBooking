import { ImageType } from "@/features/upload/types/image";

export enum RestaurantStatus {
	ACTIVE = "ACTIVE",
	INACTIVE = "INACTIVE",
}

export enum RestaurantVerifyStatus {
	PENDING = "PENDING",
	APPROVED = "APPROVED",
	REJECTED = "REJECTED",
}

export interface RestaurantSocialLink {
	type: string;
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
	slug?: string;

	userId?: string;

	createdAt?: string | Date;
	updatedAt?: string | Date;
}
