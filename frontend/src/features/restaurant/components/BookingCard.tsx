"use client";

import React, { useEffect, useState } from "react";
import { Calendar, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import CustomForm from "@/shared/components/form/CustomForm";
import { IRestaurant } from "@/features/restaurant/types/restaurant.type";
import { useAuth } from "@/shared/hooks/useAuth";
import getBookingFormFields from "@/features/restaurant/constants/restaurant-booking-form-field";
import { useAvailableTimeSlots } from "@/features/restaurant/hooks/useAvailableTimeSlots";

const DEFAULT_TIME_SLOTS = [
	"18:00",
	"18:30",
	"19:00",
	"19:30",
	"20:00",
	"20:30",
];

interface BookingCardProps {
	restaurant?: IRestaurant;
	timeSlots?: string[];
	onBook?: (values: Partial<Record<string, any>>) => void;
}

export default function BookingCard({
	restaurant,
	timeSlots,
	onBook,
}: BookingCardProps) {
	const router = useRouter();
	const { isAuthenticated, isAuthLoading } = useAuth();
	const availableTimeSlotsQuery = useAvailableTimeSlots(
		restaurant?.slug ?? "",
	);

	const getTodayString = () => {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const day = String(today.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const slots =
		timeSlots && timeSlots.length > 0
			? timeSlots
			: availableTimeSlotsQuery.data?.timeSlots?.length
				? availableTimeSlotsQuery.data.timeSlots
				: DEFAULT_TIME_SLOTS;

	const initialValues: Partial<Record<string, any>> = {
		date: getTodayString(),
		startTime: slots[0] ?? "",
		guestCount: "2",
	};

	const [values, setValues] =
		useState<Partial<Record<string, any>>>(initialValues);

	useEffect(() => {
		if (!values.startTime && slots[0]) {
			setValues((currentValues) => ({
				...currentValues,
				startTime: slots[0],
			}));
		}
	}, [slots, values.startTime]);

	const formFields = getBookingFormFields(slots, {
		date: initialValues.date,
		guests: initialValues.guestCount,
	});

	const handleSubmit = (formValues: Partial<Record<string, any>>) => {
		console.log(1);
		if (isAuthLoading) return;

		const bookingDate = String(formValues.date ?? initialValues.date ?? "");
		const startTime = String(
			formValues.startTime ?? initialValues.startTime ?? "",
		);
		const guestCount = Number(
			formValues.guestCount ?? initialValues.guestCount ?? 1,
		);

		if (!isAuthenticated) {
			router.push("/login");
			return;
		}

		onBook?.({ bookingDate, startTime, guestCount });
	};

	const footer = (
		<button
			type="submit"
			disabled={
				isAuthLoading ||
				availableTimeSlotsQuery.isLoading ||
				slots.length === 0
			}
			className="w-full py-4 bg-[#6f4e37] hover:bg-[#543d31] active:bg-[#3d2a21] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 uppercase tracking-wider mt-4"
		>
			{availableTimeSlotsQuery.isLoading
				? "Đang tải giờ..."
				: "Đặt bàn ngay"}
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
