"use client";

import SidebarLayout from "@/shared/components/layouts/sidebar/Sidebar";
import { NavItem } from "@/shared/types/navigation";
import { type ReactNode } from "react";

interface RestaurantProps {
	children: ReactNode;
}

function Restaurant({ children }: RestaurantProps) {
	const menus: NavItem[] = [
		{
			label: "Tổng quan",
			href: "/restaurant/dashboard",
			exact: true,
		},
		{
			label: "Quản lý bàn",
			children: [
				{
					label: "Danh sách bàn",
					href: "/restaurant/dashboard/tables",
					exact: true,
				},
			],
		},
		{
			label: "Đơn đặt bàn",
			children: [
				{
					label: "Check-in",
					href: "/restaurant/dashboard/bookings/check-in",
				},
				{
					label: "Sắp tới",
					href: "/restaurant/dashboard/bookings/upcoming",
				},
				{
					label: "Tất cả",
					href: "/restaurant/dashboard/bookings",
					exact: true,
				},
			],
		},
		{
			label: "Thống kê",
			href: "/restaurant/dashboard/analytic",
		},
		{
			label: "Quản lý nhà hàng",
			children: [
				{
					label: "Hồ sơ",
					href: "/restaurant/dashboard/profile",
				},
				{
					label: "Cài đặt",
					href: "/restaurant/dashboard/settings",
				},
				{
					label: "Danh sách giờ đặt bàn",
					href: "/restaurant/dashboard/availabilities",
					exact: true,
				},
				{
					label: "Quy tắc giá",
					href: "/restaurant/dashboard/pricing-rules",
					exact: true,
				},
			],
		},
	];

	return (
		<div className="flex h-screen overflow-hidden bg-[#f5efeb]">
			{/* Sidebar */}
			<SidebarLayout menus={menus} />

			{/* Content */}
			<main className="min-w-0 flex-1 overflow-y-auto p-6">
				{children}
			</main>
		</div>
	);
}

export default Restaurant;
