import { useQuery } from "@tanstack/react-query";
import {
	AvailableTimeSlotsResponse,
	restaurantPublicApi,
} from "../api/restaurant-api";
import { restaurantQueryKeys } from "../constants/query_key";

export function useAvailableTimeSlots(slug: string) {
	return useQuery<AvailableTimeSlotsResponse>({
		queryKey: restaurantQueryKeys.GET_AVAILABLE_TIME_SLOTS(slug),
		queryFn: () => restaurantPublicApi.getAvailableTimeSlots(slug),
		enabled: Boolean(slug),
		staleTime: 60_000,
	});
}
