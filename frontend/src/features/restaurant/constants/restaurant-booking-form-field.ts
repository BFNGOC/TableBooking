import { FormField } from "@/shared/types/form-field";
import { FormFieldType } from "@/shared/types/form-field-types";
import { GUEST_COUNT_OPTIONS } from "@/features/restaurant/constants/restaurant-options";

export function getBookingFormFields(
	slots: string[] | undefined,
	defaults?: { date?: string; guests?: string },
): FormField[] {
	const _slots = slots && slots.length > 0 ? slots : [];

	const initialDate = defaults?.date;
	const initialGuests = defaults?.guests ?? "2";

	const fields: FormField[] = [
		{
			name: "date",
			label: "Chọn ngày",
			type: FormFieldType.DATE_PICKER as any,
			defaultValue: initialDate as any,
			isRequired: true,
			col: 12,
		},
		{
			name: "startTime",
			label: "Giờ đặt bàn",
			type: FormFieldType.TIME_SLOTS as any,
			options: _slots.map((t) => ({ id: t, text: t })),
			isRequired: true,
			col: 12,
		},
		{
			name: "guestCount",
			label: "Số khách",
			type: FormFieldType.SELECT as any,
			options: GUEST_COUNT_OPTIONS,
			defaultValue: initialGuests,
			col: 12,
		},
	];

	return fields;
}

export default getBookingFormFields;
