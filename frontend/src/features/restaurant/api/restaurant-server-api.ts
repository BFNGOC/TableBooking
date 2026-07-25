import { serverRequest } from "@/shared/library/axios/server-api";
import { IRestaurant } from "../types/restaurant.type";

const API_URL_PREFIX = "/restaurants";

export const getRestaurantMeServerApi = async () => {
	try {
		const res = await serverRequest<IRestaurant>({
			url: `${API_URL_PREFIX}/me`,
			method: "GET",
		});
		return res.data;
	} catch (error: any) {
		if (error?.statusCode === 404) {
			return null;
		}

		throw error;
	}
};

export const getRecommendedRestaurants = async () => {
	try {
		const res = await serverRequest<IRestaurant[]>({
			url: `${API_URL_PREFIX}/recommended`,
			method: "GET",
		});
		return res.data;
	} catch (error: any) {
		if (error?.statusCode === 404) {
			return null;
		}

		throw error;
	}
};

export const getDetailRestaurant = async () => {
	try {
		const res = await serverRequest<IRestaurant>({
			url: `${API_URL_PREFIX}/:slug`,
			method: "GET",
		});
		return res.data;
	} catch (error: any) {
		if (error?.statusCode === 404) {
			return null;
		}

		throw error;
	}
};
