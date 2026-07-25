"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Heart, Star } from "lucide-react";
import { IRestaurant } from "@/features/restaurant/types/restaurant.type";

interface RestaurantCardProps {
	restaurant: IRestaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
	restaurant,
}) => {
	const {
		restaurantName,
		rating,
		address,
		cuisineTypes = [],
		avatar,
		slug,
		_id,
		priceFrom = 0,
		priceTo = 0,
	} = restaurant;

	const [isFavorite, setIsFavorite] = useState(false);

	// Determine unique page identifier slug
	const pathSlug = slug || _id;

	// Format address (extract "District, City")
	const formatAddress = (addr?: string) => {
		if (!addr) return "";
		const parts = addr.split(",");
		if (parts.length >= 2) {
			return `${parts[parts.length - 2].trim()}, ${parts[parts.length - 1].trim()}`;
		}
		return addr;
	};

	// Format average price or priceFrom into e.g. "1.200k+"
	const formatPrice = () => {
		const basePrice = priceFrom || 0;
		if (basePrice === 0) return "500k+";
		const kValue = Math.floor(basePrice / 1000);
		// Format with dot separator for thousands
		return `${kValue.toLocaleString("vi-VN")}k+`;
	};

	// Generate a simulated discount badge based on id to look like the design mockup
	const getDiscount = () => {};

	const discount = getDiscount();
	return (
		<div className="group relative flex flex-col w-full bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(111,78,55,0.08)] border border-[#e6d8c9]/30 transition-all duration-300">
			{/* Image Section */}
			<div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
				<Link
					href={`/restaurants/${pathSlug}`}
					className="block h-full w-full"
				>
					{avatar?.url ? (
						<img
							src={avatar.url}
							alt={restaurantName}
							className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
							loading="lazy"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-[#f2ede9] text-[#6f4e37] font-semibold text-center p-4">
							{restaurantName}
						</div>
					)}
				</Link>

				{/* Favorite Heart Button */}
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setIsFavorite(!isFavorite);
					}}
					className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md hover:scale-110 active:scale-95 transition-all duration-200 border border-[#e6d8c9]/20"
				>
					<Heart
						size={18}
						className={`transition-colors duration-200 ${
							isFavorite
								? "fill-red-500 text-red-500"
								: "text-gray-400 hover:text-red-500"
						}`}
					/>
				</button>

				{/* Discount Tag Overlay */}
				{discount && (
					<div className="absolute left-4 bottom-4 z-10 rounded-lg bg-[#3d2a21]/80 backdrop-blur-[2px] px-3 py-1 text-xs font-bold text-white border border-white/10">
						Ưu đãi {discount}
					</div>
				)}
			</div>

			{/* Info Section */}
			<div className="flex flex-col flex-1 p-5">
				{/* Title and Rating Line */}
				<div className="flex items-start justify-between gap-3">
					<Link
						href={`/restaurants/${pathSlug}`}
						className="no-underline"
					>
						<h3 className="text-lg font-bold text-[#3d2a21] leading-snug group-hover:text-[#6f4e37] transition-colors duration-200">
							{restaurantName}
						</h3>
					</Link>

					{rating !== undefined && (
						<div className="flex items-center gap-1 rounded-full bg-[#fcf5ec] border border-[#f5ebd9] px-2.5 py-0.5 text-xs font-extrabold text-[#6f4e37] shrink-0">
							<Star
								size={11}
								className="fill-[#e28c5c] text-[#e28c5c]"
							/>
							<span>{rating.toFixed(1)}</span>
						</div>
					)}
				</div>

				{/* Address Location */}
				{address && (
					<div className="mt-2 flex items-center gap-1 text-xs text-[#8c7a6f]">
						<MapPin size={13} className="text-[#a89080] shrink-0" />
						<span className="truncate">
							{formatAddress(address)}
						</span>
					</div>
				)}

				{/* Cuisine Tags */}
				{cuisineTypes.length > 0 && (
					<div className="mt-3.5 flex flex-wrap gap-1.5">
						{cuisineTypes.map((type) => (
							<span
								key={type}
								className="rounded-lg bg-[#f5f0ec] hover:bg-[#ebdcd1]/40 px-2.5 py-1 text-[11px] font-medium text-[#6e5a4f] transition-colors"
							>
								{type}
							</span>
						))}
					</div>
				)}

				{/* Separator Line */}
				<div className="my-5 border-t border-[#e6d8c9]/30" />

				{/* Price and Action Footer */}
				<div className="mt-auto flex items-center justify-between gap-2">
					<div className="flex flex-col">
						<span className="text-[11px] text-[#8c7a6f]">
							Giá trung bình
						</span>
						<span className="text-base font-extrabold text-[#3d2a21]">
							{formatPrice()}
						</span>
					</div>

					<Link
						href={`/restaurants/${pathSlug}`}
						className="no-underline"
					>
						<span className="inline-flex items-center justify-center rounded-full bg-[#6f4e37] hover:bg-[#543d31] active:bg-[#3d2a21] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:shadow-md transition-all duration-200">
							Đặt bàn ngay
						</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default RestaurantCard;
