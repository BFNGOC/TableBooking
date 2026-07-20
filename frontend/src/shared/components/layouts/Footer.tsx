import Link from "next/link";
import { Globe, Mail } from "lucide-react";

function Footer() {
	return (
		<footer className="border-t border-gray-200 bg-[#e3d9d3] text-[#3d2a21]">
			<div className="mx-auto max-w-375 px-6 py-10 md:px-8">
				<div className="grid gap-8 md:grid-cols-4">
					<div className="space-y-3">
						<h2 className="text-2xl font-semibold text-[#6f4e37]">
							TableSpot
						</h2>
						<p className="max-w-xs text-sm leading-6 text-[#5b483b]">
							Nền tảng đặt bàn nhà hàng cao cấp, kết nối những tâm
							hồn sành ăn với những trải nghiệm ẩm thực tinh tế
							nhất.
						</p>
					</div>

					<div className="space-y-3">
						<h3 className="font-semibold text-[#6f4e37]">
							Về TableSpot
						</h3>
						<ul className="space-y-2 text-sm text-[#5b483b]">
							<li>
								<Link
									href="/about"
									className="transition hover:text-[#6f4e37]"
								>
									Về chúng tôi
								</Link>
							</li>
							<li>
								<Link
									href="/careers"
									className="transition hover:text-[#6f4e37]"
								>
									Tuyển dụng
								</Link>
							</li>
							<li>
								<Link
									href="/blog"
									className="transition hover:text-[#6f4e37]"
								>
									Blog ẩm thực
								</Link>
							</li>
						</ul>
					</div>

					<div className="space-y-3">
						<h3 className="font-semibold text-[#6f4e37]">
							Hợp tác
						</h3>
						<ul className="space-y-2 text-sm text-[#5b483b]">
							<li>
								<Link
									href="/partner"
									className="transition hover:text-[#6f4e37]"
								>
									Trở thành đối tác
								</Link>
							</li>
							<li>
								<Link
									href="/restaurant-management"
									className="transition hover:text-[#6f4e37]"
								>
									Quản lý nhà hàng
								</Link>
							</li>
							<li>
								<Link
									href="/advertise"
									className="transition hover:text-[#6f4e37]"
								>
									Liên hệ quảng cáo
								</Link>
							</li>
						</ul>
					</div>

					<div className="space-y-3">
						<h3 className="font-semibold text-[#6f4e37]">Hỗ trợ</h3>
						<ul className="space-y-2 text-sm text-[#5b483b]">
							<li>
								<Link
									href="/privacy"
									className="transition hover:text-[#6f4e37]"
								>
									Chính sách bảo mật
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="transition hover:text-[#6f4e37]"
								>
									Điều khoản dịch vụ
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="transition hover:text-[#6f4e37]"
								>
									Câu hỏi thường gặp
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-10 flex flex-col gap-4 pt-6 text-sm text-[#5b483b] md:flex-row md:items-center md:justify-between">
					<p>© 2024 TableSpot. Nền tảng đặt bàn cao cấp.</p>

					<div className="flex items-center gap-3">
						<Link
							href="/"
							aria-label="TableSpot"
							className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#6f4e37] text-[#6f4e37] transition hover:bg-[#e3d9d3]"
						>
							<Globe size={16} />
						</Link>
						<Link
							href="mailto:hello@tablespot.vn"
							aria-label="Email"
							className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#6f4e37] text-[#6f4e37] transition hover:bg-[#e3d9d3]"
						>
							<Mail size={16} />
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
