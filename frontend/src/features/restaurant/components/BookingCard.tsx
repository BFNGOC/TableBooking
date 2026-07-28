"use client";

import React, { useState } from "react";
import { Calendar, ShieldAlert } from "lucide-react";
import CustomForm from "@/shared/components/form/CustomForm";
import { FormField } from "@/shared/types/form-field";
import { FormFieldType } from "@/shared/types/form-field-types";
import { IRestaurant } from "@/features/restaurant/types/restaurant.type";
import { useToast } from "@/shared/hooks/useToast";
import getBookingFormFields from "@/features/restaurant/constants/restaurant-booking-form-field";

interface BookingCardProps {
	restaurant?: IRestaurant;
	timeSlots?: string[];
	onBook?: (values: Partial<Record<string, any>>) => void;
}

const DEFAULT_TIME_SLOTS = [
	"18:00",
	"18:30",
	"19:00",
	"19:30",
	"20:00",
	"20:30",
];

export default function BookingCard({
	restaurant,
	timeSlots,
	onBook,
}: BookingCardProps) {
	const { showToast } = useToast();

	const getTodayString = () => {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const day = String(today.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const slots =
		timeSlots && timeSlots.length > 0 ? timeSlots : DEFAULT_TIME_SLOTS;

	const initialValues: Partial<Record<string, any>> = {
		bookingDate: getTodayString(),
		time: slots[0] ?? DEFAULT_TIME_SLOTS[0],
		guests: "2",
	};

	const [values, setValues] =
		useState<Partial<Record<string, any>>>(initialValues);

	const formFields = getBookingFormFields(slots, {
		date: initialValues.bookingDate,
		guests: initialValues.guests,
	});

	const getGuestLabel = (guestId: string | undefined) => {
		return (
			formFields
				.find((field) => field.name === "guests")
				?.options?.find((opt) => opt.id === guestId)?.text ?? guestId
		);
	};

	const handleSubmit = (formValues: Partial<Record<string, any>>) => {
		const bookingDate = formValues.bookingDate ?? initialValues.bookingDate;
		const selectedTime = formValues.time ?? initialValues.time;
		const guests = formValues.guests ?? initialValues.guests;
		const guestLabel = getGuestLabel(guests as string);

		let displayDate = bookingDate as string;
		try {
			const [y, m, d] = (bookingDate as string).split("-");
			if (y && m && d) displayDate = `${d}/${m}/${y}`;
		} catch (err) {}

		showToast(
			"success",
			"Đặt bàn thành công!",
			`Bạn đã đặt bàn ${guestLabel} tại ${restaurant?.restaurantName ?? "nhà hàng"} lúc ${selectedTime} ngày ${displayDate}.`,
		);

		onBook?.(formValues);
	};

	const footer = (
		<button
			type="submit"
			className="w-full py-4 bg-[#6f4e37] hover:bg-[#543d31] active:bg-[#3d2a21] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 uppercase tracking-wider mt-4"
		>
			Đặt bàn ngay
		</button>
	);

	return (
		<div className="bg-white rounded-3xl border border-[#e6d8c9]/40 p-6 shadow-sm sticky top-6 space-y-5 text-center">
			<div className="space-y-2">
				<div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#fcf5ec] text-[#6f4e37] mb-1">
					<Calendar size={22} />
				</div>
				<h3 className="text-lg font-bold text-[#3d2a21]">
					Đặt bàn trực tuyến
				</h3>
				<p className="text-xs text-[#8c7a6f] leading-relaxed">
					Tiết kiệm thời gian chờ đợi. Đặt bàn trực tiếp miễn phí ngay
					bây giờ để giữ chỗ tốt nhất.
				</p>
			</div>

			<CustomForm
				fields={formFields}
				values={values}
				onValuesChange={setValues}
				onSubmit={handleSubmit}
				footer={footer}
				footerCol={12}
			/>

			<div className="flex gap-2.5 p-4 bg-[#fff1f0] border border-[#f5c2c7] rounded-2xl text-[#9f3a38] text-xs leading-relaxed text-left">
				<ShieldAlert
					size={16}
					className="shrink-0 text-[#d9480f] mt-0.5"
				/>
				<div className="space-y-1">
					<p className="font-bold text-sm text-[#7f1d1d]">
						Chính sách đặt chỗ:
					</p>
					<p>
						Vui lòng đến đúng giờ. Bàn của bạn sẽ chỉ được giữ tối
						đa 15 phút sau giờ hẹn.
					</p>
				</div>
			</div>
		</div>
	);
}
