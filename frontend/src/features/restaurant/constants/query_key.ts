export const restaurantQueryKeys = {
    GET_CUISINE_TYPES: ['cuisine-types'] as const,
    GET_RESTAURANT_ME: ['restaurant', 'me'] as const,
    GET_RESTAURANT_LIST: ['restaurant', 'admin', 'list'] as const,
    GET_VERIFY_COUNT: ['restaurant', 'admin', 'verify-count'] as const,
    GET_RESTAURANT_DETAIL: (id: string) => ['restaurant', 'admin', 'detail', id] as const,
};
