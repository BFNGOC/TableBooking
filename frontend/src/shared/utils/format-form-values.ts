import { parseDate, parseTime } from "@internationalized/date";
import { FormField } from "@/shared/types/form-field";
import { FormFieldType } from "../types/form-field-types";

export type FormatMode = "toForm" | "toApi";

export function formatFormValues<T extends Record<string, any>>(
	values: Partial<T>,
	fields: FormField[],
	mode: FormatMode,
): Partial<T> {
	if (!values) return {};

	const result: Record<string, any> = {
		...values,
	};

	fields.forEach((field) => {
		const value = result[field.name];

		if (value == null || value === "") return;

		switch (field.type) {
			case FormFieldType.DATE_PICKER:
				if (mode === "toForm") {
					if (typeof value === "string") {
						result[field.name] = parseDate(value.slice(0, 10));
					}
				} else {
					// Duck-type: mọi CalendarDate/CalendarDateTime/ZonedDateTime đều có year, month, day
					if (
						value !== null &&
						typeof value === "object" &&
						"year" in value &&
						"month" in value &&
						"day" in value
					) {
						const { year, month, day } = value as {
							year: number;
							month: number;
							day: number;
						};
						result[field.name] =
							`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
					}
				}
				break;

			case FormFieldType.TIME_PICKER:
				if (mode === "toForm") {
					if (
						typeof value === "string" &&
						/^\d{2}:\d{2}$/.test(value)
					) {
						result[field.name] = parseTime(value);
					}
				} else {
					if (
						typeof value === "object" &&
						value !== null &&
						"hour" in value &&
						"minute" in value
					) {
						result[field.name] =
							`${String(value.hour).padStart(2, "0")}:${String(
								value.minute,
							).padStart(2, "0")}`;
					}
				}
				break;

			case FormFieldType.SELECT:
				if (field.name === "isActive" && typeof value === "string") {
					result[field.name] = value === "true";
				}
				break;

			default:
				break;
		}
	});

	return result as Partial<T>;
}
