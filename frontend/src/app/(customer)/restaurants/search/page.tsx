import { Metadata } from "next";
import { Suspense } from "react";
import RestaurantsRoleCustomerPage from "@/features/restaurant/pages/customer/RestaurantsRoleCustomerPage";

export const metadata: Metadata = {
	title: "Tìm kiếm nhà hàng - TableSpot",
	description:
		"Khám phá danh sách các nhà hàng sang trọng, chất lượng dịch vụ đỉnh cao và đặt bàn trực tuyến tiện lợi tại TableSpot.",
};

/**
 * /restaurants/search?keySearch=&cuisineType=&minRating=&priceRange=&guests=&sort=
 *
 * RestaurantsRoleCustomerPage is a client component that reads these search params
 * via useSearchParams() internally, so it must be wrapped in <Suspense>.
 */
export default function RestaurantsSearchPage() {
	return (
		<Suspense fallback={null}>
			<RestaurantsRoleCustomerPage />
		</Suspense>
	);
}
