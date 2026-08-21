"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleMapEmbed from "@/features/restaurant/components/GoogleMapEmbed";
import { IRestaurant } from "@/features/restaurant/types/restaurant.type";
import { useToast } from "@/shared/hooks/useToast";
import BookingCard from "@/features/restaurant/components/BookingCard";
import { formatPriceRange } from "@/features/restaurant/utils/price.utils";
import {
	Star,
	Share2,
	Heart,
	MapPin,
	CalendarDays,
	Map,
	Compass,
} from "lucide-react";

interface RestaurantDetailRoleCustomerPageProps {
	restaurant: IRestaurant;
}

function RestaurantDetailRoleCustomerPage({
	restaurant,
}: RestaurantDetailRoleCustomerPageProps) {
	const router = useRouter();
	const { showToast } = useToast();
	const [isBookingOpen, setIsBookingOpen] = useState(false);
	const [isLiked, setIsLiked] = useState(false);

	const {
		restaurantName,
		description,
		rating = 4.5,
		address,
		cuisineTypes = [],
		priceFrom = 300000,
		priceTo = 1500000,
		avatar,
		images = [],
	} = restaurant;

	const galleryImages = useMemo(() => {
		const list: string[] = [];

		if (avatar?.url) {
			list.push(avatar.url);
		}

		images.forEach((img) => {
			if (img?.url && list.length < 5) {
				list.push(img.url);
			}
		});

		return list;
	}, [avatar, images]);

	const handleShare = () => {
		if (navigator.share) {
			navigator
				.share({
					title: restaurantName,
					text: description,
					url: window.location.href,
				})
				.catch(() => {});
		} else {
			navigator.clipboard.writeText(window.location.href);
			showToast("info", "Đã sao chép liên kết vào bộ nhớ tạm!");
		}
	};

	return (
		<div className="w-full min-h-screen bg-[#fff8f5] pb-20">
			{/* Inner Container */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
				{/* Image Grid Section (Airbnb-style) */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-[24px] overflow-hidden shadow-sm">
					{/* Left Column: Big Image */}
					<div className="md:col-span-2 aspect-[4/3] md:aspect-auto md:h-[450px] relative overflow-hidden group">
						<img
							src={galleryImages[0]}
							alt={`${restaurantName} main`}
							className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
						/>
					</div>

					{/* Right Column: 4 Small Images in Subgrid */}
					<div className="grid grid-cols-2 gap-3 md:col-span-2">
						{galleryImages.slice(1, 5).map((img, idx) => {
							const isLast = idx === 3;
							return (
								<div
									key={idx}
									className="aspect-[4/3] md:h-[218px] relative overflow-hidden group"
								>
									<img
										src={img}
										alt={`${restaurantName} details ${idx + 1}`}
										className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
									/>
									{isLast && (
										<div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center flex-col gap-1 cursor-pointer">
											<span className="text-white text-base font-extrabold">
												+{images.length - 3} ảnh
											</span>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>

				{/* Two Column Layout: Details on Left, Booking CTA on Right */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
					{/* Left Section (Details, Dishes, Location) */}
					<div className="lg:col-span-8 space-y-8">
						{/* Title Header Block */}
						<div className="space-y-4">
							<div className="flex justify-between items-start gap-4">
								<div>
									<h1 className="text-3xl md:text-4xl font-extrabold text-[#3d2a21]">
										Nhà hàng {restaurantName}
									</h1>
									{/* Tag/Details Line */}
									<div className="flex flex-wrap items-center gap-1.5 text-xs text-[#8c7a6f] font-medium mt-2">
										<div className="flex items-center gap-0.5 text-[#e28c5c]">
											<Star
												size={14}
												className="fill-[#e28c5c]"
											/>
											<span className="font-extrabold">
												{rating.toFixed(1)}
											</span>
										</div>
										<span>•</span>
										<span>
											{(rating * 24).toFixed(0)}+ đánh giá
										</span>
										<span>•</span>
										<span className="bg-[#f5f0ec] text-[#6e5a4f] py-0.5 px-2 rounded-md text-[11px] font-semibold">
											{cuisineTypes.length > 0
												? cuisineTypes.join(", ")
												: "Ẩm thực"}
										</span>
										<span>•</span>
										<span className="font-bold text-[#6f4e37]">
											{formatPriceRange(
												priceFrom,
												priceTo,
											)}
										</span>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={handleShare}
										className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#e6d8c9] text-gray-500 hover:text-[#6f4e37] shadow-xs hover:scale-105 active:scale-95 transition-all"
									>
										<Share2 size={16} />
									</button>
									<button
										type="button"
										onClick={() => setIsLiked(!isLiked)}
										className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#e6d8c9] shadow-xs hover:scale-105 active:scale-95 transition-all"
									>
										<Heart
											size={16}
											className={
												isLiked
													? "fill-red-500 text-red-500"
													: "text-gray-500 hover:text-red-500"
											}
										/>
									</button>
								</div>
							</div>
						</div>

						{/* Divider */}
						<div className="border-t border-[#e6d8c9]/40" />

						{/* Description */}
						<div className="space-y-3">
							<p className="text-[#6e5a4f] text-sm leading-relaxed whitespace-pre-line">
								{description ||
									`Tọa lạc tại vị trí thuận lợi, ${restaurantName} mang đến một hành trình ẩm thực tinh tế, kết hợp hài hòa giữa các nguyên liệu truyền thống và phong cách chế biến hiện đại. Không gian được thiết kế sang trọng, ấm cúng cùng đội ngũ phục vụ chuyên nghiệp, cam kết đem lại trải nghiệm ẩm thực đẳng cấp nhất cho mỗi bữa tiệc của bạn.`}
							</p>
						</div>

						{/* Divider */}
						<div className="border-t border-[#e6d8c9]/40" />

						{/* Vị trí nhà hàng */}
						<div className="space-y-4">
							<h2 className="text-xl font-bold text-[#3d2a21] flex items-center gap-1.5">
								<Compass size={20} className="text-[#a89080]" />
								Vị trí nhà hàng
							</h2>

							{/* Map Mockup */}
							<div className="relative w-full h-[240px] rounded-2xl overflow-hidden shadow-xs border border-[#e6d8c9]/30 bg-[#f7f3ef] flex items-center justify-center group">
								<GoogleMapEmbed
									address={
										address || "TP. Hồ Chí Minh, Việt Nam"
									}
								/>
							</div>

							{/* Address Footer details */}
							<div className="flex items-start justify-between gap-4 mt-2">
								<div className="flex items-start gap-1.5 text-xs text-[#6e5a4f] leading-relaxed">
									<MapPin
										size={15}
										className="text-[#a89080] shrink-0 mt-0.5"
									/>
									<span>
										{address || "TP. Hồ Chí Minh, Việt Nam"}
									</span>
								</div>

								<a
									href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
										address || restaurantName,
									)}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-xs font-bold text-[#6f4e37] hover:text-[#543d31] flex items-center gap-1 shrink-0 no-underline"
								>
									<Map size={13} />
									Chỉ đường
								</a>
							</div>
						</div>
					</div>

					{/* Right Section (Booking Single Button Replacement Card) */}
					<div className="lg:col-span-4">
						<BookingCard
							restaurant={restaurant}
							onBook={(values) => {
								if (!restaurant.slug) return;

								const query = new URLSearchParams({
									bookingDate: String(
										values.bookingDate ?? "",
									),
									startTime: String(values.startTime ?? ""),
									guestCount: String(values.guestCount ?? 1),
								});
								router.push(
									`/restaurants/${restaurant.slug}/reserve?${query}`,
								);
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default RestaurantDetailRoleCustomerPage;
