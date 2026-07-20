import FilterBar from "@/features/restaurant/components/FilterBar";
import Search from "@/features/restaurant/components/Search";
function RestaurantsRoleCustomerPage() {
	return (
		<div className="w-full">
			<div className="p-8 bg-[#faf1ed]">
				<Search className="w-full max-w-7xl mx-auto rounded-xl py-2 px-4" />
			</div>
			<div className="bg-[#fff8f5] grid grid-cols-12 gap-6 items-start">
				<div className="col-span-12 md:col-span-3">
					<FilterBar />
				</div>

				<div className="col-span-12 md:col-span-9">
					<div className="p-4">Nhà Hàng</div>
				</div>
			</div>
		</div>
	);
}

export default RestaurantsRoleCustomerPage;
