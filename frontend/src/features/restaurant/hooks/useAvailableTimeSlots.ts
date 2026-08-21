import { useQuery } from "@tanstack/react-query";
import {
	getAvailableTimeSlotsApi,
	AvailableTimeSlotsResponse,
} from "../api/restaurant-api";
import { restaurantQueryKeys } from "../constants/query_key";

export function useAvailableTimeSlots(slug: string) {
	return useQuery<AvailableTimeSlotsResponse>({
		queryKey: restaurantQueryKeys.GET_AVAILABLE_TIME_SLOTS(slug),
		queryFn: () => getAvailableTimeSlotsApi(slug),
		enabled: Boolean(slug),
		staleTime: 60_000,
	});
}
