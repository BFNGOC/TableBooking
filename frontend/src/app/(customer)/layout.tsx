import NavbarPublic from "@/shared/components/layouts/Navbar";
import Footer from "@/shared/components/layouts/Footer";
import type { ReactNode } from "react";

interface PublicLayoutProps {
	children: ReactNode;
}
function PublicLayout({ children }: PublicLayoutProps) {
	const navItems = [
		{
			label: "Khám phá",
			href: "/",
		},
		{
			label: "Nhà hàng",
			href: "/restaurants",
		},
	];

	return (
		<div className="flex min-h-screen flex-col">
			<div className="bg-[#e3d9d3]">
				<NavbarPublic navItems={navItems} />
			</div>

			<div className="flex-1 bg-[#f5efeb]">
				<main className="mx-auto w-full">{children}</main>
			</div>

			<Footer />
		</div>
	);
}

export default PublicLayout;
