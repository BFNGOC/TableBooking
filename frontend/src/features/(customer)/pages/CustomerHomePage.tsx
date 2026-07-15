"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Heart, Users, Handshake, Eye, ArrowRight } from "lucide-react";
import { useGetMe } from "@/features/users/hooks/useGetMe";
import { useToast } from "@/shared/hooks/useToast";
import { IRestaurant } from "@/features/restaurant/types/restaurant.type";
import RestaurantCard from "../components/RestaurantCard";
import Search from "../components/Search";

interface CustomerHomePageProps {
	restaurants: IRestaurant[];
}

function CustomerHomePage({ restaurants = [] }: CustomerHomePageProps) {
	const { showToast } = useToast();
	const { data: session } = useSession();
	const { data: userData } = useGetMe();

	// Filter active restaurants to show under "Featured in the week"
	// Usually we show the first 4 active restaurants
	const featuredRestaurants = restaurants
		.filter((r) => r.status === "ACTIVE" || r.status === undefined)
		.slice(0, 4);

	const diningStyles = [
		{
			title: "Lãng mạn",
			subtitle: "Hẹn hò & Kỷ niệm",
			description:
				"Không gian ấm cúng, lung linh ánh nến lý tưởng cho các cặp đôi.",
			icon: <Heart className="text-[#e28c5c] shrink-0" size={24} />,
			bgIcon: "bg-[#fdf5f0]",
			hoverBorder: "hover:border-[#e28c5c]/30",
		},
		{
			title: "Gia đình",
			subtitle: "Ấm cúng & Gần gũi",
			description:
				"Bàn tiệc rộng rãi, thực đơn phong phú cho mọi thành viên.",
			icon: <Users className="text-[#e28c5c] shrink-0" size={24} />,
			bgIcon: "bg-[#fdf5f0]",
			hoverBorder: "hover:border-[#e28c5c]/30",
		},
		{
			title: "Tiếp khách",
			subtitle: "Sang trọng & Riêng tư",
			description:
				"Không gian yên tĩnh, trang trọng, phục vụ chuyên nghiệp đẳng cấp.",
			icon: <Handshake className="text-[#e28c5c] shrink-0" size={24} />,
			bgIcon: "bg-[#fdf5f0]",
			hoverBorder: "hover:border-[#e28c5c]/30",
		},
		{
			title: "View đẹp",
			subtitle: "Toàn cảnh thành phố",
			description:
				"Khung cảnh lung linh từ rooftop hoặc cửa kính panorama ấn tượng.",
			icon: <Eye className="text-[#e28c5c] shrink-0" size={24} />,
			bgIcon: "bg-[#fdf5f0]",
			hoverBorder: "hover:border-[#e28c5c]/30",
		},
	];

	return (
		<div className="space-y-16">
			{/* HERO SECTION */}
			<section className="relative w-full h-[520px] md:h-[580px] overflow-hidden shadow-xl">
				{/* Background Image */}
				<div
					className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 scale-105"
					style={{
						backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop')`,
					}}
				/>
				{/* Dark Overlay */}
				<div className="absolute inset-0 bg-black/60 md:bg-black/55 backdrop-brightness-75" />

				{/* Content Container */}
				<div className="absolute inset-0 flex flex-col justify-center items-center px-4 text-center z-10">
					<h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-3xl mb-8">
						Trải nghiệm tinh hoa
						<br />
						ẩm thực đẳng cấp
					</h1>

					{/* Search Bar Component */}
					<div className="w-full max-w-4xl px-2">
						<Search />
					</div>
				</div>
			</section>

			<div className="space-y-12 pb-20 max-w-375 md:px-5 lg:px-6">
				{/* FEATURED RESTAURANTS SECTION */}
				<section className="space-y-6 ">
					<div className="flex items-end justify-between border-b border-gray-100 pb-4">
						<div className="space-y-1">
							<p className="text-[11px] font-extrabold tracking-widest text-[#8c7a6f] uppercase">
								LỰA CHỌN HÀNG ĐẦU
							</p>
							<h2 className="text-2xl md:text-3xl font-extrabold text-[#3d2a21]">
								Nhà hàng nổi bật trong tuần
							</h2>
						</div>

						<Link
							href="/restaurants"
							className="flex items-center gap-1 text-sm font-bold text-[#6f4e37] hover:text-[#543d31] transition-colors group no-underline"
						>
							<span>Xem tất cả</span>
							<ArrowRight
								size={16}
								className="transition-transform duration-200 group-hover:translate-x-1"
							/>
						</Link>
					</div>

					{/* Grid layout */}
					{featuredRestaurants.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
							{featuredRestaurants.map((restaurant) => (
								<RestaurantCard
									key={restaurant._id}
									restaurant={restaurant}
								/>
							))}
						</div>
					) : (
						<div className="text-center py-12 text-[#8c7a6f] bg-white rounded-3xl border border-dashed border-gray-200">
							Chưa có nhà hàng nổi bật nào trong tuần này.
						</div>
					)}
				</section>

				{/* OCCASION / STYLE SECTION */}
				<section className="space-y-8 py-4">
					<div className="text-center space-y-3 max-w-2xl mx-auto">
						<h2 className="text-2xl md:text-3xl font-extrabold text-[#3d2a21]">
							Khám phá theo phong cách
						</h2>
						<p className="text-sm text-[#8c7a6f] leading-relaxed">
							Mọi dịp kỷ niệm đều xứng đáng có một không gian hoàn
							hảo. Hãy chọn phong cách phù hợp với tâm trạng của
							bạn hôm nay.
						</p>
					</div>

					{/* Categories Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{diningStyles.map((style) => (
							<div
								key={style.title}
								className={`group bg-white border border-gray-100 rounded-3xl p-6 text-center flex flex-col items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${style.hoverBorder} cursor-pointer`}
							>
								{/* Icon Wrapper */}
								<div
									className={`w-14 h-14 rounded-full flex items-center justify-center ${style.bgIcon} transition-transform duration-300 group-hover:scale-110`}
								>
									{style.icon}
								</div>

								<div className="space-y-1.5">
									<h3 className="text-lg font-extrabold text-[#3d2a21]">
										{style.title}
									</h3>
									<p className="text-xs font-semibold text-[#8c7a6f]">
										{style.subtitle}
									</p>
								</div>

								<p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
									{style.description}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* PARTNER / RESTAURANT ONBOARDING BANNER */}
				<section className="bg-[#543d31] rounded-[20px] overflow-hidden shadow-lg relative min-h-[380px] md:min-h-[420px] flex items-stretch">
					<div className="grid md:grid-cols-12 w-full">
						{/* Left Column: Text & Actions */}
						<div className="col-span-12 md:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-center text-left space-y-6 z-10">
							<span className="text-[10px] font-extrabold tracking-widest text-[#d8c5b8] uppercase">
								DÀNH CHO CHỦ NHÀ HÀNG
							</span>

							<h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
								Nâng tầm quản lý,
								<br />
								tối ưu doanh thu cùng
								<br />
								TableSpot
							</h2>

							<p className="text-sm text-[#e6dbd3] leading-relaxed max-w-lg font-light">
								Gia nhập mạng lưới nhà hàng cao cấp nhất Việt
								Nam. Tiếp cận hàng triệu khách hàng và quản lý
								vận hành chỉ với một nền tảng duy nhất.
							</p>

							<div className="flex flex-wrap gap-4 pt-2">
								<Link
									href="/restaurant-onboarding"
									className="bg-white hover:bg-[#f5efeb] text-[#543d31] font-bold text-sm px-6 py-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg no-underline active:scale-98"
								>
									Hợp tác ngay
								</Link>

								<Link
									href="/partner"
									className="bg-transparent hover:bg-white/10 text-white border border-white/40 font-bold text-sm px-6 py-3.5 rounded-full transition-all duration-200 no-underline active:scale-98"
								>
									Tìm hiểu thêm
								</Link>
							</div>
						</div>

						{/* Right Column: Image */}
						<div className="hidden md:block md:col-span-5 relative min-h-[300px]">
							<div
								className="absolute inset-0 bg-cover bg-no-repeat bg-[center_top_10%]"
								style={{
									backgroundImage: `url('https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop')`,
								}}
							/>
							{/* Shadow Gradient from Left to Right */}
							<div className="absolute inset-y-0 -left-1 w-24 bg-gradient-to-r from-[#543d31] to-transparent" />
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

export default CustomerHomePage;
