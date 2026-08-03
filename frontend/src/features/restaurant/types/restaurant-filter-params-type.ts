import { FilterParams } from "@/shared/types/filter-params-type";
import { RestaurantStatus, RestaurantVerifyStatus } from "./restaurant.type";

export interface RestaurantFilterRoleAdminParams extends FilterParams {
	restaurantCode: string;

	taxCode?: string;

	verifyStatus: RestaurantVerifyStatus;

	status?: RestaurantStatus;

	fromDate?: string;

	toDate?: string;
}

export interface RestaurantFilterRoleCustomerParams extends FilterParams {
	cuisineTypes?: string[];

	minPrice?: number;

	maxPrice?: number;

	minRating?: number;
}
