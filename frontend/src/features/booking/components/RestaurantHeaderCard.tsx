'use client';

import CustomCard from '@/shared/components/card/CustomCard';

interface RestaurantHeaderCardProps {
    restaurant?: {
        restaurantName?: string;
        address?: string;
        phone?: string;
        rating?: number;
        priceFrom?: number;
        priceTo?: number;
    } | null;
}

function RestaurantHeaderCard({ restaurant }: RestaurantHeaderCardProps) {
    if (!restaurant) {
        return null;
    }

    return (
        <CustomCard>
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-[#1f2937]">
                        {restaurant.restaurantName}
                    </h1>

                    {restaurant.address && (
                        <p className="mt-1 text-sm text-gray-500">{restaurant.address}</p>
                    )}
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    {restaurant.phone && (
                        <div>
                            <span className="font-medium text-gray-700">Số điện thoại:</span>{' '}
                            {restaurant.phone}
                        </div>
                    )}

                    {restaurant.rating !== undefined && (
                        <div>
                            <span className="font-medium text-gray-700">Đánh giá:</span> ⭐{' '}
                            {restaurant.rating}
                        </div>
                    )}

                    {(restaurant.priceFrom !== undefined || restaurant.priceTo !== undefined) && (
                        <div>
                            <span className="font-medium text-gray-700">Mức giá:</span>{' '}
                            {restaurant.priceFrom?.toLocaleString()} -{' '}
                            {restaurant.priceTo?.toLocaleString()}
                        </div>
                    )}
                </div>
            </div>
        </CustomCard>
    );
}

export default RestaurantHeaderCard;
