export const FormFieldType = {
	// Input
	TEXT: "text",
	EMAIL: "email",
	PASSWORD: "password",
	NUMBER: "number",
	TEXTAREA: "textarea",
	SEARCH: "search",

	// Select
	SELECT: "select",
	SELECT_ASYNC: "selectAsync",
	AUTOCOMPLETE: "autocomplete",

	// Date & Time
	DATE: "date",
	TIME: "time",
	DATETIME: "datetime",
	DATE_RANGE: "dateRange",
	TIME_RANGE: "timeRange",
	DATE_PICKER: "datePicker",
	TIME_PICKER: "timePicker",
	TIME_SLOTS: "timeSlots",
	DATE_TIME_PICKER: "dateTimePicker",
	DATE_RANGE_PICKER: "dateRangePicker",

	// Choice
	CHECKBOX: "checkbox",
	CHECKBOX_GROUP: "checkboxGroup",
	RADIO: "radio",
	RADIO_GROUP: "radioGroup",
	SWITCH: "switch",

	// Upload
	IMAGE: "image",
	FILE: "file",

	// Others
	SLIDER: "slider",
	COLOR: "color",
	CUSTOM: "custom",
} as const;

export type FormFieldType = (typeof FormFieldType)[keyof typeof FormFieldType];
