import { notFound } from "next/navigation";
import RestaurantDetailRoleCustomerPage from "@/features/restaurant/pages/customer/RestaurantDetailRoleCustomerPage";
import { IRestaurant } from "@/features/restaurant/types/restaurant.type";
import { getDetailRestaurant } from "@/features/restaurant/api/restaurant-server-api";
interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
	const { slug } = await params;
	const restaurant = await getDetailRestaurant(slug);

	return {
		title: restaurant
			? `${restaurant.restaurantName} - Đặt bàn trực tuyến | TableSpot`
			: "Chi tiết nhà hàng - TableSpot",
	};
}

export default async function RestaurantDetailPublicPage({
	params,
}: PageProps) {
	const { slug } = await params;

	const restaurant = await getDetailRestaurant(slug);

	if (!restaurant) {
		notFound();
	}

	return <RestaurantDetailRoleCustomerPage restaurant={restaurant} />;
}
