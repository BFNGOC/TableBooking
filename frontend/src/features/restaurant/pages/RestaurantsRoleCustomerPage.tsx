"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FilterBar from "@/features/restaurant/components/FilterBar";
import Search from "@/features/restaurant/components/Search";
import RestaurantCard from "@/features/restaurant/components/RestaurantCard";
import SelectField from "@/shared/components/select/SelectField";
import { IRestaurant } from "@/features/restaurant/types/restaurant.type";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

interface RestaurantsRoleCustomerPageProps {
	restaurants: IRestaurant[];
}

const ITEMS_PER_PAGE = 6;
const SORT_OPTIONS = [
	{ id: "default", text: "Phù hợp nhất" },
	{ id: "rating-desc", text: "Đánh giá cao nhất" },
	{ id: "price-asc", text: "Giá: Thấp đến cao" },
	{ id: "price-desc", text: "Giá: Cao đến thấp" },
];

function RestaurantsRoleCustomerPage({
	restaurants = [],
}: RestaurantsRoleCustomerPageProps) {
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get("q") || "";
	const [activeFilters, setActiveFilters] = useState<
		Partial<Record<string, any>>
	>({});
	const [sortBy, setSortBy] = useState<string>("default");
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, activeFilters, sortBy]);

	const filteredRestaurants = useMemo(() => {
		let result = restaurants.filter(
			(r) => r.status === "ACTIVE" || r.status === undefined,
		);

		if (searchQuery.trim() !== "") {
			const q = searchQuery.toLowerCase();
			result = result.filter(
				(r) =>
					r.restaurantName.toLowerCase().includes(q) ||
					(r.description || "").toLowerCase().includes(q) ||
					(r.address || "").toLowerCase().includes(q),
			);
		}

		if (activeFilters.priceRange) {
			const range = activeFilters.priceRange;
			result = result.filter((r) => {
				const from = r.priceFrom || 0;
				const to = r.priceTo || 0;

				if (range === "under-500") {
					return from < 500000;
				} else if (range === "500-800") {
					return from <= 800000 && to >= 500000;
				} else if (range === "800-1200") {
					return from <= 1200000 && to >= 800000;
				} else if (range === "1200-2000") {
					return from <= 2000000 && to >= 1200000;
				} else if (range === "above-2000") {
					return to >= 2000000 || from >= 2000000;
				}
				return true;
			});
		}

		if (activeFilters.cuisine) {
			const filterCuisine = activeFilters.cuisine;
			result = result.filter((r) => {
				const types = (r.cuisineTypes || []).map((t) =>
					t.toLowerCase(),
				);
				const desc = (r.description || "").toLowerCase();

				if (filterCuisine === "european") {
					return types.some(
						(t) =>
							t.includes("âu") ||
							t.includes("ý") ||
							t.includes("pháp") ||
							t.includes("pizza") ||
							t.includes("mediterranean"),
					);
				} else if (filterCuisine === "fine-dining") {
					return (
						types.some(
							(t) => t.includes("fine") || t.includes("kaiseki"),
						) ||
						desc.includes("thượng hạng") ||
						desc.includes("tinh tế") ||
						desc.includes("sang trọng")
					);
				} else if (filterCuisine === "modern-vietnamese") {
					return types.some(
						(t) => t.includes("việt") || t.includes("phở"),
					);
				} else if (filterCuisine === "seafood") {
					return types.some(
						(t) => t.includes("hải sản") || t.includes("seafood"),
					);
				}
				return true;
			});
		}

		if (activeFilters.rating) {
			const filterRating = parseFloat(activeFilters.rating);
			result = result.filter((r) => {
				const rating = r.rating || 0;
				if (filterRating === 5) {
					return rating >= 5.0;
				} else if (filterRating === 4) {
					return rating >= 4.0;
				}
				return true;
			});
		}

		if (activeFilters.amenities && activeFilters.amenities.length > 0) {
			const selectedAmenities = activeFilters.amenities as string[];
			result = result.filter((r) => {
				const desc = (r.description || "").toLowerCase();
				return selectedAmenities.every((amenity) => {
					if (amenity === "private-room") {
						return (
							desc.includes("phòng riêng") ||
							desc.includes("riêng tư") ||
							desc.includes("yên tĩnh") ||
							desc.includes("tiệc") ||
							desc.includes("kaiseki") ||
							desc.includes("secret")
						);
					}
					if (amenity === "parking") {
						return (
							desc.includes("rộng rãi") ||
							desc.includes("đỗ xe") ||
							desc.includes("đậu xe") ||
							desc.includes("landmark") ||
							desc.includes("vincom") ||
							desc.includes("riverside")
						);
					}
					if (amenity === "free-wifi") {
						return true;
					}
					if (amenity === "smoking-area") {
						return (
							desc.includes("sân vườn") ||
							desc.includes("ngoài trời") ||
							desc.includes("rooftop") ||
							desc.includes("riverside")
						);
					}
					return true;
				});
			});
		}

		if (sortBy === "rating-desc") {
			result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
		} else if (sortBy === "price-asc") {
			result.sort((a, b) => (a.priceFrom || 0) - (b.priceFrom || 0));
		} else if (sortBy === "price-desc") {
			result.sort((a, b) => (b.priceFrom || 0) - (a.priceFrom || 0));
		}

		return result;
	}, [restaurants, searchQuery, activeFilters, sortBy]);

	const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE);
	const paginatedRestaurants = useMemo(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		return filteredRestaurants.slice(start, start + ITEMS_PER_PAGE);
	}, [filteredRestaurants, currentPage]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		const container = document.getElementById("restaurant-list-container");
		if (container) {
			container.scrollIntoView({ behavior: "smooth" });
		}
	};

	const handleFilterSubmit = (values: Partial<Record<string, any>>) => {
		setActiveFilters(values);
	};

	const handleFilterReset = () => {
		setActiveFilters({});
	};

	return (
		<div className="w-full min-h-screen bg-[#fff8f5]">
			{/* Search Banner */}
			<div className="p-8 md:p-12 bg-[#faf1ed] border-b border-[#e6d8c9]/20">
				<div className="max-w-6xl mx-auto space-y-4">
					<Search className="w-full bg-white rounded-2xl py-3 px-5 shadow-sm border border-[#e6d8c9]/50" />
				</div>
			</div>

			{/* Main Grid Content */}
			<div
				id="restaurant-list-container"
				className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid grid-cols-12 gap-8 items-start"
			>
				{/* Desktop Filter Sidebar (hidden on small screens) */}
				<div className="hidden md:block md:col-span-3 bg-white rounded-3xl border border-[#e6d8c9]/40 overflow-hidden shadow-sm sticky top-6">
					<FilterBar
						initialValues={activeFilters}
						onSubmit={handleFilterSubmit}
						onReset={handleFilterReset}
					/>
				</div>

				{/* Results Container */}
				<div className="col-span-12 md:col-span-9 space-y-6">
					{/* Header summary of results */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#e6d8c9]/30">
						<div>
							<h1 className="text-2xl md:text-3xl font-extrabold text-[#3d2a21]">
								Tìm thấy {filteredRestaurants.length} nhà hàng
							</h1>
							<p className="text-xs text-[#8c7a6f] mt-1 font-medium">
								tại TP. Hồ Chí Minh khớp với tìm kiếm của bạn
							</p>
						</div>

						{/* Sorting & Filter controls */}
						<div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
							{/* Mobile Filter Toggle (hidden on desktop) */}
							<button
								type="button"
								onClick={() =>
									setShowMobileFilter(!showMobileFilter)
								}
								className="md:hidden flex items-center gap-1.5 px-4 py-2.5 bg-white border border-[#e6d8c9] rounded-xl text-xs font-bold text-[#6f4e37] shadow-sm active:scale-95 transition-all"
							>
								<SlidersHorizontal size={14} />
								Bộ lọc
							</button>

							<div className="w-full sm:w-auto">
								<SelectField
									name="sortBy"
									value={sortBy}
									onChange={(value) => setSortBy(value)}
									options={SORT_OPTIONS}
								/>
							</div>
						</div>
					</div>

					{/* Mobile Filter Modal Panel */}
					{showMobileFilter && (
						<div className="md:hidden fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
							<div className="w-80 h-full bg-white shadow-xl overflow-y-auto flex flex-col animate-slide-in">
								<div className="p-4 border-b border-[#e6d8c9]/30 flex justify-between items-center bg-[#fff8f5]">
									<span className="font-bold text-[#3d2a21]">
										Bộ lọc tìm kiếm
									</span>
									<button
										type="button"
										onClick={() =>
											setShowMobileFilter(false)
										}
										className="text-gray-400 hover:text-gray-600 font-bold"
									>
										Đóng
									</button>
								</div>
								<div className="flex-1">
									<FilterBar
										initialValues={activeFilters}
										onSubmit={(values) => {
											handleFilterSubmit(values);
											setShowMobileFilter(false);
										}}
										onReset={() => {
											handleFilterReset();
											setShowMobileFilter(false);
										}}
									/>
								</div>
							</div>
						</div>
					)}

					{/* Restaurant Grid */}
					{paginatedRestaurants.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
							{paginatedRestaurants.map((restaurant) => (
								<RestaurantCard
									key={restaurant._id}
									restaurant={restaurant}
								/>
							))}
						</div>
					) : (
						<div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#e6d8c9]/60 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
							<p className="text-base font-bold text-[#3d2a21]">
								Không tìm thấy nhà hàng nào phù hợp
							</p>
							<p className="text-xs text-[#8c7a6f] mt-1.5 max-w-sm mx-auto">
								Vui lòng thay đổi từ khóa tìm kiếm hoặc bỏ bớt
								các bộ lọc để tiếp tục khám phá.
							</p>
							<button
								type="button"
								onClick={handleFilterReset}
								className="mt-6 px-6 py-2.5 bg-[#6f4e37] text-white text-xs font-bold rounded-full hover:bg-[#543d31] transition-colors"
							>
								Xóa tất cả bộ lọc
							</button>
						</div>
					)}

					{/* Pagination Controls */}
					{totalPages > 1 && (
						<div className="flex items-center justify-center gap-2 pt-8">
							{/* Prev Button */}
							<button
								type="button"
								disabled={currentPage === 1}
								onClick={() =>
									handlePageChange(currentPage - 1)
								}
								className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#e6d8c9]/80 text-[#6f4e37] hover:bg-[#fcf5ec] disabled:opacity-40 disabled:hover:bg-white shadow-xs transition-all cursor-pointer"
							>
								<ChevronLeft size={16} />
							</button>

							{/* Page Numbers */}
							{Array.from(
								{ length: totalPages },
								(_, i) => i + 1,
							).map((page) => {
								const isActive = currentPage === page;
								return (
									<button
										key={page}
										type="button"
										onClick={() => handlePageChange(page)}
										className={`h-10 w-10 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
											isActive
												? "bg-[#6f4e37] text-white shadow-md shadow-[#6f4e37]/20 scale-105"
												: "bg-white border border-[#e6d8c9]/80 text-[#6f4e37] hover:bg-[#fcf5ec]"
										}`}
									>
										{page}
									</button>
								);
							})}

							{/* Next Button */}
							<button
								type="button"
								disabled={currentPage === totalPages}
								onClick={() =>
									handlePageChange(currentPage + 1)
								}
								className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#e6d8c9]/80 text-[#6f4e37] hover:bg-[#fcf5ec] disabled:opacity-40 disabled:hover:bg-white shadow-xs transition-all cursor-pointer"
							>
								<ChevronRight size={16} />
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default RestaurantsRoleCustomerPage;
