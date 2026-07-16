import { Metadata } from "next";
import CustomerHomePage from "@/features/(customer)/pages/HomeRoleCustomerPage";
import { IRestaurant } from "@/features/restaurant/types/restaurant.type";
import restaurantsData from "../../../data/restaurants-mock-data.json";

export const metadata: Metadata = {
	title: "TableSpot - Trải nghiệm tinh hoa ẩm thực đẳng cấp",
	description:
		"Khám phá và đặt bàn tại các nhà hàng ẩm thực hàng đầu Việt Nam. Kết nối trải nghiệm ẩm thực tinh tế, sang trọng, ấm cúng và view đẹp.",
};

export default async function Home() {
	const restaurants = restaurantsData as unknown as IRestaurant[];

	return <CustomerHomePage restaurants={restaurants} />;
}
