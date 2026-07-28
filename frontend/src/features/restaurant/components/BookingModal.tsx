"use client";

import React, { useState } from "react";
import ModalCustom from "@/shared/components/modals/ModalCustom";
import { useToast } from "@/shared/hooks/useToast";
import { Calendar, Clock, Users, ShieldAlert } from "lucide-react";
import CustomForm from "@/shared/components/form/CustomForm";
import { FormField } from "@/shared/types/form-field";
import { FormFieldType } from "@/shared/types/form-field-types";

interface BookingModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	restaurantName: string;
	timeSlots?: string[];
}

const DEFAULT_TIME_SLOTS = [
	"18:00",
	"18:30",
	"19:00",
	"19:30",
	"20:00",
	"20:30",
];
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
	timeSlots,
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

	const slots =
		timeSlots && timeSlots.length > 0 ? timeSlots : DEFAULT_TIME_SLOTS;

	const initialValues: Partial<Record<string, any>> = {
		bookingDate: getTodayString(),
		time: slots[0] ?? DEFAULT_TIME_SLOTS[0],
		guests: "2 người",
	};

	const [values, setValues] =
		useState<Partial<Record<string, any>>>(initialValues);

	const handleSubmit = (formValues: Partial<Record<string, any>>) => {
		const bookingDate = formValues.bookingDate ?? initialValues.bookingDate;
		const selectedTime = formValues.time ?? initialValues.time;
		const guests = formValues.guests ?? initialValues.guests;

		// Format date for the success display (e.g. DD/MM/YYYY)
		let displayDate = bookingDate as string;
		try {
			const [y, m, d] = (bookingDate as string).split("-");
			if (y && m && d) displayDate = `${d}/${m}/${y}`;
		} catch (err) {}

		showToast(
			"success",
			"Đặt bàn thành công!",
			`Bạn đã đặt bàn ${guests} tại ${restaurantName} lúc ${selectedTime} ngày ${displayDate}.`,
		);

		onOpenChange(false);
	};

	const formFields: FormField[] = [
		{
			name: "bookingDate",
			label: "Chọn ngày",
			type: FormFieldType.DATE_PICKER as any,
			defaultValue: initialValues.bookingDate as any,
			isRequired: true,
			col: 12,
		},
		{
			name: "time",
			label: "Giờ đặt bàn",
			type: FormFieldType.TIME_SLOTS as any,
			options: slots.map((t) => ({ id: t, text: t })),
			isRequired: true,
			col: 12,
		},
		{
			name: "guests",
			label: "Số khách",
			type: FormFieldType.SELECT as any,
			options: GUEST_OPTIONS.map((opt) => ({ id: opt, text: opt })),
			defaultValue: initialValues.guests,
			col: 12,
		},
	];

	const footer = (
		<>
			<button
				type="submit"
				className="w-full py-4 bg-[#6f4e37] hover:bg-[#543d31] active:bg-[#3d2a21] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 uppercase tracking-wider mt-4"
			>
				Xác nhận đặt bàn
			</button>
		</>
	);

	return (
		<ModalCustom
			open={isOpen}
			onOpenChange={onOpenChange}
			title="Đặt bàn trực tuyến"
			size="md"
			isDismissable={true}
		>
			<CustomForm
				fields={formFields}
				values={values}
				onValuesChange={setValues}
				onSubmit={handleSubmit}
				footer={footer}
				footerCol={12}
			/>

			<div className="flex gap-2.5 p-3.5 bg-[#fdf2f2] border border-[#fde8e8] rounded-xl text-red-700 text-xs mt-4">
				<ShieldAlert
					size={16}
					className="shrink-0 text-red-500 mt-0.5"
				/>
				<div className="space-y-0.5">
					<span className="font-bold">Chính sách đặt chỗ:</span>
					<p className="text-[#a24e4e] leading-relaxed">
						Vui lòng đến đúng giờ. Bàn của bạn sẽ chỉ được giữ tối
						đa 15 phút sau giờ hẹn.
					</p>
				</div>
			</div>
		</ModalCustom>
	);
};

export default BookingModal;
