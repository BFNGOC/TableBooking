"use client";

import React, { useState } from "react";
import ModalCustom from "@/shared/components/modals/ModalCustom";
import { useToast } from "@/shared/hooks/useToast";
import { Calendar, Clock, Users, ShieldAlert } from "lucide-react";

interface BookingModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	restaurantName: string;
}

const TIME_SLOTS = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30"];
const GUEST_OPTIONS = [
	"1 người",
	"2 người",
	"3 người",
	"4 người",
	"5 người",
	"6 người",
	"7-10 người",
	"10+ người",
];

export const BookingModal: React.FC<BookingModalProps> = ({
	isOpen,
	onOpenChange,
	restaurantName,
}) => {
	const { showToast } = useToast();

	// Default to today's date formatted as YYYY-MM-DD
	const getTodayString = () => {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const day = String(today.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const [bookingDate, setBookingDate] = useState(getTodayString());
	const [selectedTime, setSelectedTime] = useState("18:00");
	const [guests, setGuests] = useState("2 người");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Format date for the success display (e.g. DD/MM/YYYY)
		let displayDate = bookingDate;
		try {
			const [y, m, d] = bookingDate.split("-");
			if (y && m && d) displayDate = `${d}/${m}/${y}`;
		} catch (err) {}

		// Trigger toast notification
		showToast(
			"success",
			"Đặt bàn thành công!",
			`Bạn đã đặt bàn ${guests} tại ${restaurantName} lúc ${selectedTime} ngày ${displayDate}.`
		);

		// Close modal
		onOpenChange(false);
	};

	return (
		<ModalCustom
			open={isOpen}
			onOpenChange={onOpenChange}
			title="Đặt bàn trực tuyến"
			size="md"
			isDismissable={true}
		>
			<form onSubmit={handleSubmit} className="space-y-6 py-2">
				<p className="text-xs text-[#8c7a6f] -mt-2">
					Điền thông tin đặt bàn của bạn tại{" "}
					<strong className="text-[#6f4e37]">{restaurantName}</strong>.
					Chúng tôi sẽ xác nhận ngay lập tức.
				</p>

				{/* Select Date */}
				<div className="space-y-2">
					<label className="text-xs font-bold text-[#3d2a21] uppercase tracking-wider flex items-center gap-1.5">
						<Calendar size={14} className="text-[#a89080]" />
						Chọn ngày
					</label>
					<input
						type="date"
						value={bookingDate}
						min={getTodayString()}
						onChange={(e) => setBookingDate(e.target.value)}
						required
						className="w-full px-4 py-3 rounded-xl border border-[#e6d8c9] bg-white text-[#3d2a21] text-sm focus:outline-none focus:ring-2 focus:ring-[#6f4e37]/20 focus:border-[#6f4e37] transition-all"
					/>
				</div>

				{/* Select Time Slots */}
				<div className="space-y-2">
					<label className="text-xs font-bold text-[#3d2a21] uppercase tracking-wider flex items-center gap-1.5">
						<Clock size={14} className="text-[#a89080]" />
						Giờ đặt bàn
					</label>
					<div className="grid grid-cols-3 gap-2">
						{TIME_SLOTS.map((time) => {
							const isSelected = selectedTime === time;
							return (
								<button
									key={time}
									type="button"
									onClick={() => setSelectedTime(time)}
									className={`py-3 text-xs font-semibold rounded-xl transition-all duration-200 ${
										isSelected
											? "bg-[#6f4e37] text-white shadow-sm"
											: "bg-[#fcf5ec] text-[#6f4e37] hover:bg-[#f5ebd9] border border-[#f5ebd9]"
									}`}
								>
									{time}
								</button>
							);
						})}
					</div>
				</div>

				{/* Select Guests */}
				<div className="space-y-2">
					<label className="text-xs font-bold text-[#3d2a21] uppercase tracking-wider flex items-center gap-1.5">
						<Users size={14} className="text-[#a89080]" />
						Số khách
					</label>
					<select
						value={guests}
						onChange={(e) => setGuests(e.target.value)}
						className="w-full px-4 py-3 rounded-xl border border-[#e6d8c9] bg-white text-[#3d2a21] text-sm focus:outline-none focus:ring-2 focus:ring-[#6f4e37]/20 focus:border-[#6f4e37] transition-all appearance-none cursor-pointer"
						style={{
							backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236f4e37' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
							backgroundPosition: "right 1rem center",
							backgroundSize: "1.25rem",
							backgroundRepeat: "no-repeat",
							paddingRight: "2.5rem",
						}}
					>
						{GUEST_OPTIONS.map((opt) => (
							<option key={opt} value={opt}>
								{opt}
							</option>
						))}
					</select>
				</div>

				{/* Confirm Button */}
				<button
					type="submit"
					className="w-full py-4 bg-[#6f4e37] hover:bg-[#543d31] active:bg-[#3d2a21] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 uppercase tracking-wider mt-4"
				>
					Xác nhận đặt bàn
				</button>

				{/* Policy warning box */}
				<div className="flex gap-2.5 p-3.5 bg-[#fdf2f2] border border-[#fde8e8] rounded-xl text-red-700 text-xs">
					<ShieldAlert size={16} className="shrink-0 text-red-500 mt-0.5" />
					<div className="space-y-0.5">
						<span className="font-bold">Chính sách đặt chỗ:</span>
						<p className="text-[#a24e4e] leading-relaxed">
							Vui lòng đến đúng giờ. Bàn của bạn sẽ chỉ được giữ tối đa 15
							phút sau giờ hẹn.
						</p>
					</div>
				</div>
			</form>
		</ModalCustom>
	);
};

export default BookingModal;
