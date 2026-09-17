import { useQuery } from "@tanstack/react-query";
import { restaurantPublicApi } from "../api/restaurant-api";
import { restaurantQueryKeys } from "../constants/query_key";
import { RestaurantFilterRoleCustomerParams } from "../types/restaurant-filter-params-type";

export const useGetRestaurants = (
	filters: RestaurantFilterRoleCustomerParams,
) =>
	useQuery({
		queryKey: [
			...restaurantQueryKeys.GET_RESTAURANT_CUSTOMER_LIST,
			filters,
		],
		queryFn: () => restaurantPublicApi.getRestaurants(filters),
	});
