"use client";

import React, { useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FilterBar from "@/features/restaurant/components/FilterBar";
import Search from "@/features/restaurant/components/RestaurantSearch";
import RestaurantCard from "@/features/restaurant/components/RestaurantCard";
import RestaurantSort from "@/features/restaurant/components/RestaurantSort";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import useTable from "@/shared/hooks/useTable";
import { restaurantPublicApi } from "@/features/restaurant/api/restaurant-api";
import { restaurantQueryKeys } from "@/features/restaurant/constants/query_key";
import { RestaurantFilterRoleCustomerParams } from "@/features/restaurant/types/restaurant-filter-params-type";
import { IRestaurant } from "@/features/restaurant/types/restaurant.type";
import { buildRestaurantCustomerParams } from "@/features/restaurant/utils/restaurant-filter.utils";
import filterRestaurantFormFields from "@/features/restaurant/constants/restaurant-filter-form-field";
import searchRestaurantFormFields from "@/features/restaurant/constants/restaurant-search-form-field";
import selectRestaurantFormFields from "@/features/restaurant/constants/restaurant-sort-form-field";
import {
	getDefaultDate,
	getDefaultTime,
} from "@/shared/utils/current-date-time";

const ALL_FORM_FIELDS = [
	...searchRestaurantFormFields,
	...filterRestaurantFormFields,
	...selectRestaurantFormFields,
];

function initialFormValuesFromUrl(
	searchParams: URLSearchParams,
): Record<string, any> {
	return {
		keySearch: searchParams.get("keySearch") ?? "",
		guests: searchParams.get("guests") ?? "2",
		date: searchParams.get("date") ?? getDefaultDate(),
		time: searchParams.get("time") ?? getDefaultTime(),
		priceRange: searchParams.get("priceRange") ?? "",
		cuisineType: searchParams.get("cuisineType") ?? undefined,
		minRating: searchParams.get("minRating") ?? undefined,
		sort: searchParams.get("sort") ?? "default",
	};
}

function buildSearchUrl(formValues: Record<string, any>): string {
	const sp = new URLSearchParams();

	const str = (v: any) => (v != null ? String(v).trim() : "");

	if (str(formValues.keySearch))
		sp.set("keySearch", str(formValues.keySearch));
	if (str(formValues.guests)) sp.set("guests", str(formValues.guests));
	if (str(formValues.date)) sp.set("date", str(formValues.date));
	if (str(formValues.time)) sp.set("time", str(formValues.time));
	if (str(formValues.priceRange))
		sp.set("priceRange", str(formValues.priceRange));
	if (str(formValues.cuisineType))
		sp.set("cuisineType", str(formValues.cuisineType));
	if (str(formValues.minRating))
		sp.set("minRating", str(formValues.minRating));
	if (str(formValues.sort) && formValues.sort !== "default")
		sp.set("sort", str(formValues.sort));

	const qs = sp.toString();
	return qs ? `/restaurants/search?${qs}` : "/restaurants/search";
}

function RestaurantsRoleCustomerPage() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);
	const listContainerRef = useRef<HTMLDivElement>(null);

	const urlFormValues = initialFormValuesFromUrl(searchParams);
	const urlApiParams = buildRestaurantCustomerParams(
		urlFormValues,
		ALL_FORM_FIELDS,
	);

	const {
		data: restaurants,
		pagination,
		fetching,
		loading,
		filterValues,
		handleFilterChange,
		handleParamsChange,
		handleChangePage,
		handleFilterReset,
	} = useTable<IRestaurant, RestaurantFilterRoleCustomerParams>({
		queryKey: restaurantQueryKeys.GET_RESTAURANT_CUSTOMER_LIST,
		fetchApi: restaurantPublicApi.getRestaurants,
		initialFilters: {
			pageSize: 6,
			...urlApiParams,
		},
	});

	const formValues = {
		...urlFormValues,
		...(filterValues as Record<string, any>),
	};

	const submitForm = (values: Record<string, any>) => {
		const apiParams = buildRestaurantCustomerParams(
			values,
			ALL_FORM_FIELDS,
		);
		router.replace(buildSearchUrl(values), { scroll: false });
		handleParamsChange({
			...apiParams,
			pageSize: 6,
		} as Partial<RestaurantFilterRoleCustomerParams>);
	};

	const handleSearchSubmit = () => {
		submitForm(formValues);
	};

	const handleFilterSubmit = () => {
		submitForm(formValues);
		setShowMobileFilter(false);
	};

	const handleSortChange = (value: string) => {
		const newValues = { ...formValues, sort: value };
		handleFilterChange(newValues as any);
		submitForm(newValues);
	};

	const handleReset = () => {
		const resetValues = initialFormValuesFromUrl(new URLSearchParams());
		handleFilterChange(resetValues as any);
		router.replace("/restaurants/search", { scroll: false });
		handleFilterReset();
	};

	const handleFilterPartialReset = () => {
		const resetValues = {
			...formValues,
			priceRange: "",
			cuisineType: undefined,
			minRating: undefined,
		};
		handleFilterChange(resetValues as any);
		submitForm(resetValues);
	};

	const handlePageChange = (page: number) => {
		handleChangePage(page);
		listContainerRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const isLoading = loading || fetching;
	const totalPages = pagination?.totalPages ?? 1;
	const currentPage = pagination?.currentPage ?? 1;
	const totalItems = pagination?.totalItems ?? 0;

	return (
		<div className="w-full min-h-screen bg-[#fff8f5]">
			{/* Search Banner */}
			<div className="p-8 md:p-12 bg-[#faf1ed] border-b border-[#e6d8c9]/20">
				<div className="max-w-6xl mx-auto space-y-4">
					<Search
						className="w-full bg-white rounded-2xl py-3 px-5 shadow-sm border border-[#e6d8c9]/50"
						values={formValues}
						onValuesChange={(v) =>
							handleFilterChange({ ...formValues, ...v } as any)
						}
						onSubmit={handleSearchSubmit}
					/>
				</div>
			</div>

			{/* Main Grid Content */}
			<div
				id="restaurant-list-container"
				ref={listContainerRef}
				className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid grid-cols-12 gap-8 items-start"
			>
				{/* Desktop Filter Sidebar (hidden on small screens) */}
				<div className="hidden md:block md:col-span-3 bg-white rounded-3xl border border-[#e6d8c9]/40 overflow-hidden shadow-sm sticky top-6">
					<FilterBar
						values={formValues}
						onValuesChange={(v) =>
							handleFilterChange({ ...formValues, ...v } as any)
						}
						onSubmit={handleFilterSubmit}
						onReset={handleFilterPartialReset}
					/>
				</div>

				{/* Results Container */}
				<div className="col-span-12 md:col-span-9 space-y-6">
					{/* Header summary of results */}
					<div className="flex flex-col justify-between sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#e6d8c9]/30">
						<div>
							<h1 className="text-2xl md:text-3xl font-extrabold text-[#3d2a21]">
								{isLoading
									? "Đang tìm kiếm..."
									: `Tìm thấy ${totalItems} nhà hàng`}
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

							<RestaurantSort
								value={formValues.sort ?? "default"}
								onChange={handleSortChange}
								className="w-full sm:w-auto sm:ml-auto"
							/>
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
										values={formValues}
										onValuesChange={(v) =>
											handleFilterChange({
												...formValues,
												...v,
											} as any)
										}
										onSubmit={handleFilterSubmit}
										onReset={() => {
											handleFilterPartialReset();
											setShowMobileFilter(false);
										}}
									/>
								</div>
							</div>
						</div>
					)}

					{/* Loading skeleton */}
					{isLoading && (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
							{Array.from({ length: 6 }).map((_, i) => (
								<div
									key={i}
									className="h-72 bg-white rounded-3xl border border-[#e6d8c9]/40 animate-pulse"
								/>
							))}
						</div>
					)}

					{/* Restaurant Grid */}
					{!isLoading &&
						(restaurants.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
								{restaurants.map((restaurant) => (
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
									Vui lòng thay đổi từ khóa tìm kiếm hoặc bỏ
									bớt các bộ lọc để tiếp tục khám phá.
								</p>
								<button
									type="button"
									onClick={handleReset}
									className="mt-6 px-6 py-2.5 bg-[#6f4e37] text-white text-xs font-bold rounded-full hover:bg-[#543d31] transition-colors"
								>
									Xóa tất cả bộ lọc
								</button>
							</div>
						))}

					{/* Pagination Controls */}
					{!isLoading && totalPages > 1 && (
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
