import { FormField } from "@/shared/types/form-field";
import { FormFieldType } from "@/shared/types/form-field-types";

export const CHAT_MESSAGE_FORM_FIELDS: FormField[] = [
	{
		name: "content",
		type: FormFieldType.TEXTAREA,
		placeholder: "Nhập tin nhắn...",
		col: 12,
		isRequired: true,
		className: "min-h-20 resize-none",
	},
];
