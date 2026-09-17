export const areaQueryKeys = {
	ALL: ["areas"] as const,
	GET_AREAS: (restaurantId: string) => ["areas", restaurantId] as const,
	GET_AREA: (areaId: string) => ["areas", "detail", areaId] as const,
};
