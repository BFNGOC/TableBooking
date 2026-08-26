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
			label: "Quản lý nhà hàng",
			children: [
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
		{
			label: "Đơn đặt bàn",
			children: [
				{
					label: "Hôm nay",
					href: "/restaurant/dashboard/bookings/today",
				},
				{
					label: "Lịch sử",
					href: "/restaurant/dashboard/bookings/history",
				},
			],
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
