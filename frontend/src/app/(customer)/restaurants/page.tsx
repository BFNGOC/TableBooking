import { Metadata } from "next";
import RestaurantsRoleCustomerPage from "@/features/restaurant/pages/customer/RestaurantsRoleCustomerPage";

export const metadata: Metadata = {
	title: "Tìm kiếm nhà hàng - TableSpot",
	description:
		"Khám phá danh sách các nhà hàng sang trọng, chất lượng dịch vụ đỉnh cao và đặt bàn trực tuyến tiện lợi tại TableSpot.",
};

function RestaurantsPublicPage() {
	return <RestaurantsRoleCustomerPage />;
}

export default RestaurantsPublicPage;
