import { Metadata } from "next";
import RestaurantsRoleCustomerPage from "@/features/restaurant/pages/RestaurantsRoleCustomerPage";
import { IRestaurant } from "@/features/restaurant/types/restaurant.type";
import restaurantsData from "../../../../data/restaurants-mock-data.json";

export const metadata: Metadata = {
	title: "Tìm kiếm nhà hàng - TableSpot",
	description:
		"Khám phá danh sách các nhà hàng sang trọng, chất lượng dịch vụ đỉnh cao và đặt bàn trực tuyến tiện lợi tại TableSpot.",
};

function RestaurantsPublicPage() {
	const restaurants = restaurantsData as unknown as IRestaurant[];

	return <RestaurantsRoleCustomerPage restaurants={restaurants} />;
}

export default RestaurantsPublicPage;
