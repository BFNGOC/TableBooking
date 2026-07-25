import { clientRequest } from "@/shared/library/axios/client-api";
import {
	RestaurantOnboardingPayload,
	UpdateRestaurantOnboardingPayload,
	UpdateRestaurantProfilePayload,
} from "../types/restaurant.dto";
import { IRestaurant } from "../types/restaurant.type";
import {
	RestaurantFilterRoleAdminParams,
	RestaurantFilterRoleCustomerParams,
} from "../types/restaurant-filter-params-type";
import {
	RestaurantAdminDetailResponse,
	RestaurantListAdminResponse,
	TaxVerificationResponse,
	VerifyStatusCount,
} from "../types/restaurant-admin-response-type";

const API_URL_PREFIX = "/restaurants";

export const getCuisineTypesApi = async () => {
	const res = await clientRequest<any>({
		url: `${API_URL_PREFIX}/cuisine-types`,
		method: "GET",
	});

	return res.data;
};

export const restaurantPublicApi = {
	getRestaurants: async (queryParams: RestaurantFilterRoleCustomerParams) => {
		const res = await clientRequest<IRestaurant[]>({
			url: `${API_URL_PREFIX}`,
			method: "GET",
			queryParams,
		});
		return res.data;
	},
};

export const getRestaurantMeApi = async () => {
	const res = await clientRequest<IRestaurant>({
		url: `${API_URL_PREFIX}/me`,
		method: "GET",
	});
	return res.data;
};

export const restaurantRoleRestaurantApi = {
	updateMe: async (payload: UpdateRestaurantProfilePayload) => {
		const res = await clientRequest<IRestaurant>({
			url: `${API_URL_PREFIX}/me`,
			method: "PATCH",
			body: payload,
		});

		return res;
	},
};

export const restaurantRoleCustomerApi = {
	onboarding: async (payload: RestaurantOnboardingPayload) => {
		const res = await clientRequest<IRestaurant>({
			url: `${API_URL_PREFIX}/onboarding`,
			method: "POST",
			body: payload,
		});

		return res.data;
	},
	updateOnboarding: async (payload: UpdateRestaurantOnboardingPayload) => {
		const res = await clientRequest<IRestaurant>({
			url: `${API_URL_PREFIX}/onboarding/me`,
			method: "patch",
			body: payload,
		});

		return res.data;
	},
	verifyEmail: async (payload: { _id: string; code: string }) => {
		const res = await clientRequest<IRestaurant>({
			url: `${API_URL_PREFIX}/verify-email`,
			method: "POST",
			body: payload,
		});

		return res.data;
	},
	resendVerifyEmail: async () => {
		const res = await clientRequest({
			url: `${API_URL_PREFIX}/resend-email`,
			method: "POST",
		});

		return res.data;
	},
};

export const restaurantRoleAdminApi = {
	getAll: async (queryParams: RestaurantFilterRoleAdminParams) => {
		const res = await clientRequest<RestaurantListAdminResponse>({
			url: `${API_URL_PREFIX}/admin`,
			method: "GET",
			queryParams,
		});

		return res.data;
	},
	verifyStatusCount: async () => {
		const res = await clientRequest<VerifyStatusCount>({
			url: `${API_URL_PREFIX}/admin/verify-status-count`,
			method: "GET",
		});

		return res.data;
	},
	getDetail: async (id: string) => {
		const res = await clientRequest<RestaurantAdminDetailResponse>({
			url: `${API_URL_PREFIX}/admin/${id}`,
			method: "GET",
		});

		return res.data;
	},
	checkTaxCode: async (id: string) => {
		const res = await clientRequest<TaxVerificationResponse>({
			url: `${API_URL_PREFIX}/admin/${id}/verify-tax-code`,
			method: "POST",
		});

		return res;
	},
	approve: async (id: string) => {
		const res = await clientRequest({
			url: `${API_URL_PREFIX}/admin/${id}/approve`,
			method: "PATCH",
		});

		return res;
	},
	reject: async (id: string, reason: string) => {
		const res = await clientRequest({
			url: `${API_URL_PREFIX}/admin/${id}/reject`,
			method: "PATCH",
			body: { reason },
		});

		return res;
	},
};
