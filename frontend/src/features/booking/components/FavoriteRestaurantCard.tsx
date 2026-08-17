'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';

export default function FavoriteRestaurantCard({
    name,
    category,
    rating,
    reviews,
    image,
}: {
    name: string;
    category: string;
    rating: string;
    reviews: string;
    image: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-2xl bg-[#fdf3ee] p-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
                <Image src={image} alt={name} fill className="object-cover" />
            </div>

            <div className="min-w-0">
                <h3 className="truncate font-semibold text-[#211b18]">{name}</h3>

                <p className="truncate text-xs text-[#8a7d75]">{category}</p>

                <p className="mt-1 text-xs text-[#765237]">
                    ★ {rating} ({reviews})
                </p>
            </div>

            <Heart size={19} className="ml-auto shrink-0 fill-red-600 text-red-600" />
        </div>
    );
}
