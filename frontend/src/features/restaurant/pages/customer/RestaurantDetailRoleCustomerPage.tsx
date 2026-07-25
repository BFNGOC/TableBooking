"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import GoogleMapEmbed from "@/features/restaurant/components/GoogleMapEmbed";
import { IRestaurant } from "@/features/restaurant/types/restaurant.type";
import { useToast } from "@/shared/hooks/useToast";
import BookingModal from "@/features/restaurant/components/BookingModal";
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

// Fallback images based on cuisine type
const CUISINE_FALLBACKS: Record<string, string[]> = {
	european: [
		"https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800",
		"https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800",
		"https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800",
		"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800",
		"https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800",
	],
	japanese: [
		"https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=80&w=800",
		"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800",
		"https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=800",
		"https://images.unsplash.com/photo-1582450871972-ab5ca641643d?q=80&w=800",
		"https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=800",
	],
	bbq: [
		"https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800",
		"https://images.unsplash.com/photo-1598515214211-89d3e73ae83b?q=80&w=800",
		"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800",
		"https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=800",
		"https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=800",
	],
	seafood: [
		"https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=800",
		"https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?q=80&w=800",
		"https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=800",
		"https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=800",
		"https://images.unsplash.com/photo-1579631542720-3a87824ff8c9?q=80&w=800",
	],
	general: [
		"https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800",
		"https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800",
		"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
		"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800",
		"https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800",
	],
};

// Fallback dishes based on cuisine type
interface Dish {
	name: string;
	price: string;
	description: string;
	image: string;
}

const DISHES_MAPPING: Record<string, Dish[]> = {
	european: [
		{
			name: "Bò Wagyu Nướng Đá",
			price: "1.250k",
			description:
				"Bò Wagyu thượng hạng nướng trên đá nóng, kèm sốt tiêu đen và khoai tây nghiền truffle.",
			image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400",
		},
		{
			name: "Cá Hồi Áp Chảo",
			price: "680k",
			description:
				"Cá hồi Na Uy áp chảo với măng tây, sốt chanh leo và hạt quinoa giòn tan.",
			image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=400",
		},
	],
	japanese: [
		{
			name: "Sushi & Sashimi Premium Set",
			price: "950k",
			description:
				"Các loại hải sản tươi sống nhập khẩu trực tiếp từ chợ Toyosu, Nhật Bản, chế biến bởi đầu bếp 5 sao.",
			image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=400",
		},
		{
			name: "Tempura Tôm Hoàng Gia",
			price: "420k",
			description:
				"Tôm sú tươi chiên giòn phong cách Tempura giòn rụm với nước tương dashi thanh mát.",
			image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=400",
		},
	],
	bbq: [
		{
			name: "Combo Thịt Nướng Gogi Đặc Biệt",
			price: "599k",
			description:
				"Thịt bò Wagyu vân mỡ đều, dẻ sườn bò Mỹ và ba chỉ heo nướng cùng sốt Gogi đặc trưng.",
			image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400",
		},
		{
			name: "Lẩu Kim Chi Hải Sản",
			price: "280k",
			description:
				"Nước lẩu kim chi chua cay đậm đà với tôm, mực, nghêu và các loại nấm tươi.",
			image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=400",
		},
	],
	seafood: [
		{
			name: "Tôm Hùm Đút Lò Phô Mai",
			price: "1.450k",
			description:
				"Tôm hùm bông Nha Trang đút lò với sốt bơ tỏi và lớp phô mai Mozzarella béo ngậy tan chảy.",
			image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=400",
		},
		{
			name: "Cua Huỳnh Đế Hấp Gừng",
			price: "2.800k",
			description:
				"Cua Huỳnh Đế tươi sống hấp hành gừng giữ trọn vị ngọt tự nhiên đậm đà của thịt cua.",
			image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=400",
		},
	],
	general: [
		{
			name: "Nấm Đông Cô Xốt Dầu Hào Chay",
			price: "180k",
			description:
				"Nấm đông cô tươi xào cải thìa thanh đạm, kết hợp nước sốt dầu hào chay đậm đà.",
			image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400",
		},
		{
			name: "Đậu Hũ Tứ Xuyên Chay",
			price: "150k",
			description:
				"Đậu hũ non mềm mịn nấu cùng sốt cay Tứ Xuyên và nấm đùi gà cắt hạt lựu.",
			image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400",
		},
	],
};

function RestaurantDetailRoleCustomerPage({
	restaurant,
}: RestaurantDetailRoleCustomerPageProps) {
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

	const cuisineKey = useMemo(() => {
		const typesStr = cuisineTypes.join(" ").toLowerCase();
		if (
			typesStr.includes("âu") ||
			typesStr.includes("pháp") ||
			typesStr.includes("ý") ||
			typesStr.includes("pizza")
		) {
			return "european";
		}
		if (
			typesStr.includes("nhật") ||
			typesStr.includes("sushi") ||
			typesStr.includes("á") ||
			typesStr.includes("kaiseki")
		) {
			return "japanese";
		}
		if (
			typesStr.includes("nướng") ||
			typesStr.includes("bbq") ||
			typesStr.includes("hàn quốc")
		) {
			return "bbq";
		}
		if (typesStr.includes("hải sản") || typesStr.includes("seafood")) {
			return "seafood";
		}
		return "general";
	}, [cuisineTypes]);

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

		const fallbacks =
			CUISINE_FALLBACKS[cuisineKey] || CUISINE_FALLBACKS.general;
		let fallbackIdx = 0;
		while (list.length < 5 && fallbackIdx < fallbacks.length) {
			if (!list.includes(fallbacks[fallbackIdx])) {
				list.push(fallbacks[fallbackIdx]);
			}
			fallbackIdx++;
		}

		while (list.length < 5) {
			list.push(
				"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800",
			);
		}

		return list;
	}, [avatar, images, cuisineKey]);

	const dishes = useMemo(() => {
		return DISHES_MAPPING[cuisineKey] || DISHES_MAPPING.general;
	}, [cuisineKey]);

	const formatPriceRange = () => {
		if (!priceFrom && !priceTo) return "500k - 1.500k VND";
		const fromK = Math.floor(priceFrom / 1000).toLocaleString("vi-VN");
		const toK = Math.floor(priceTo / 1000).toLocaleString("vi-VN");
		return `${fromK}k - ${toK}k VND`;
	};

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
												+12 ảnh
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
												? cuisineTypes[0]
												: "Ẩm thực"}
										</span>
										<span>•</span>
										<span className="font-bold text-[#6f4e37]">
											{formatPriceRange()}
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

						{/* Món ăn đặc sắc */}
						<div className="space-y-5">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-bold text-[#3d2a21]">
									Món ăn đặc sắc
								</h2>
								<span className="text-xs font-bold text-[#6f4e37] hover:underline cursor-pointer">
									Xem thực đơn đầy đủ →
								</span>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{dishes.map((dish, index) => (
									<div
										key={index}
										className="flex bg-white rounded-2xl border border-[#e6d8c9]/30 p-3 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(111,78,55,0.04)] transition-all gap-4"
									>
										<div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
											<img
												src={dish.image}
												alt={dish.name}
												className="h-full w-full object-cover"
											/>
										</div>
										<div className="flex-1 space-y-1">
											<div className="flex justify-between items-start gap-1">
												<h4 className="text-sm font-bold text-[#3d2a21]">
													{dish.name}
												</h4>
												<span className="text-xs font-bold text-[#e28c5c] shrink-0">
													{dish.price}
												</span>
											</div>
											<p className="text-[11px] text-[#8c7a6f] leading-relaxed line-clamp-2">
												{dish.description}
											</p>
										</div>
									</div>
								))}
							</div>
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
					<div className="lg:col-span-4 bg-white rounded-3xl border border-[#e6d8c9]/40 p-6 shadow-sm sticky top-6 space-y-5 text-center">
						<div className="space-y-2">
							<div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#fcf5ec] text-[#6f4e37] mb-1">
								<CalendarDays size={22} />
							</div>
							<h3 className="text-lg font-bold text-[#3d2a21]">
								Đặt bàn trực tuyến
							</h3>
							<p className="text-xs text-[#8c7a6f] leading-relaxed">
								Tiết kiệm thời gian chờ đợi. Đặt bàn trực tiếp
								miễn phí ngay bây giờ để giữ chỗ tốt nhất.
							</p>
						</div>

						{/* Booking Button CTA */}
						<button
							type="button"
							onClick={() => setIsBookingOpen(true)}
							className="w-full py-4 bg-[#6f4e37] hover:bg-[#543d31] active:bg-[#3d2a21] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 uppercase tracking-wider active:scale-98"
						>
							Đặt bàn ngay
						</button>

						<div className="border-t border-[#e6d8c9]/20 pt-4 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
							<span>Xác nhận nhanh chóng qua TableSpot</span>
						</div>
					</div>
				</div>
			</div>

			{/* Booking Modal Popup */}
			<BookingModal
				isOpen={isBookingOpen}
				onOpenChange={setIsBookingOpen}
				restaurantName={restaurantName}
			/>
		</div>
	);
}

export default RestaurantDetailRoleCustomerPage;
