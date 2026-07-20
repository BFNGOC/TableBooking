"use client";

import { FieldError, Label, ListBox, Select } from "@heroui/react";
import { FormField } from "@/shared/types/form-field";

function SelectField({
	label,
	name,
	placeholder,
	isRequired,
	isDisabled,
	value,
	onChange,
	options = [],
}: FormField) {
	return (
		<div className="w-full">
			<Select
				name={name}
				placeholder={placeholder}
				isRequired={isRequired}
				isDisabled={isDisabled}
				selectedKey={value ?? null}
				onChange={(value) => {
					if (Array.isArray(value)) {
						onChange?.(value[0]?.toString() ?? "");
					} else {
						onChange?.(value?.toString() ?? "");
					}
				}}
			>
				{label ? (
					<Label className="mb-2 text-sm font-medium text-gray-700">
						{label}
					</Label>
				) : null}

				<Select.Trigger>
					<Select.Value />
					<Select.Indicator />
				</Select.Trigger>

				<Select.Popover>
					<ListBox>
						{options.map((option) => (
							<ListBox.Item
								key={option.id}
								id={option.id}
								textValue={option.text}
							>
								{option.text}
								<ListBox.ItemIndicator />
							</ListBox.Item>
						))}
					</ListBox>
				</Select.Popover>

				<FieldError />
			</Select>
		</div>
	);
}

export default SelectField;
