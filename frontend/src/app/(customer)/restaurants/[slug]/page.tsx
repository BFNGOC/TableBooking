import { notFound } from "next/navigation";
import RestaurantDetailRoleCustomerPage from "@/features/restaurant/pages/customer/RestaurantDetailRoleCustomerPage";
import { IRestaurant } from "@/features/restaurant/types/restaurant.type";
import restaurantsData from "../../../../../data/restaurants-mock-data.json";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
	const { slug } = await params;
	const restaurants = restaurantsData as unknown as IRestaurant[];
	const restaurant = restaurants.find(
		(r) => r.slug === slug || r._id === slug,
	);

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
	const restaurants = restaurantsData as unknown as IRestaurant[];

	const restaurant = restaurants.find(
		(r) => r.slug === slug || r._id === slug,
	);

	if (!restaurant) {
		notFound();
	}

	return <RestaurantDetailRoleCustomerPage restaurant={restaurant} />;
}
