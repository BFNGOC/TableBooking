"use client";

import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { IRestaurant } from "@/features/restaurant/types/restaurant.type";

interface RestaurantCardProps {
	restaurant: IRestaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
	const { restaurantName, rating, address, cuisineTypes, avatar, slug, _id } =
		restaurant;

	const cuisine =
		cuisineTypes && cuisineTypes.length > 0 ? cuisineTypes.join(", ") : "";
	// Format address: e.g. "Quận 1, TP. Hồ Chí Minh" from "12 Nguyễn Huệ, Quận 1, TP.HCM"
	const formatAddress = (addr: string) => {
		if (!addr) return "";
		const parts = addr.split(",");
		if (parts.length >= 2) {
			return `${parts[parts.length - 2].trim()}, ${parts[parts.length - 1].trim()}`;
		}
		return addr;
	};

	return (
		<Link
			href={`/restaurants/${slug || _id}`}
			className="group flex flex-col w-full text-left transition-all duration-300 no-underline"
		>
			<div className="relative aspect-[4/5] w-full overflow-hidden rounded-[32px] bg-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md">
				{avatar?.url ? (
					<img
						src={avatar.url}
						alt={restaurantName}
						className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						loading="lazy"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-[#e3d9d3] text-[#6f4e37] font-semibold text-center p-4">
						{restaurantName}
					</div>
				)}

				{/* Rating badge */}
				{rating !== undefined && (
					<div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
						<span className="text-yellow-400">★</span>
						<span>{rating.toFixed(1)}</span>
					</div>
				)}
			</div>

			<div className="mt-4 px-1">
				{/* Cuisine Type */}
				{cuisine && (
					<div className="text-[11px] font-extrabold tracking-widest text-[#8c7a6f] uppercase">
						{cuisine}
					</div>
				)}

				{/* Restaurant Name */}
				<h3 className="mt-1 text-lg font-bold text-[#3d2a21] leading-snug group-hover:text-[#6f4e37] transition-colors duration-200">
					{restaurantName}
				</h3>

				{/* Location */}
				{address && (
					<div className="mt-1.5 flex items-center gap-1 text-xs text-[#8c7a6f]">
						<MapPin size={13} className="text-[#a89080] shrink-0" />
						<span className="truncate">
							{formatAddress(address)}
						</span>
					</div>
				)}
			</div>
		</Link>
	);
};

export default RestaurantCard;
