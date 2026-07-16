import FilterBar from "@/features/restaurant/components/FilterBar";

function RestaurantsRoleCustomerPage() {
	return (
		<div className="w-full">
			<div className="grid grid-cols-12 gap-6 items-start">
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
