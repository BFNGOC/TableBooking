export const reviewQueryKeys = {
    ALL: ['reviews'],
    MY: ['reviews', 'me'],
    BY_RESTAURANT: (restaurantId: string) => ['reviews', 'restaurant', restaurantId],
};
