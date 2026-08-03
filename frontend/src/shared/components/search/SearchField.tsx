"use client";

import { FormField } from "@/shared/types/form-field";
import {
	SearchField as HeroSearchField,
	Label,
	FieldError,
} from "@heroui/react";

export default function SearchFieldCustom({
	label,
	name,
	placeholder,
	isRequired,
	isDisabled,
	isReadOnly,
	defaultValue,
	value,
	onChange,
	validate,
	className,
	minValue,
}: FormField) {
	return (
		<HeroSearchField
			name={name}
			isRequired={isRequired}
			isDisabled={isDisabled}
			isReadOnly={isReadOnly}
			minValue={minValue}
			defaultValue={defaultValue}
			value={value ?? defaultValue}
			onChange={onChange}
			validate={validate}
			className={className}
		>
			{label ? (
				<Label className="mb-2 text-sm font-medium text-gray-700">
					{label}
				</Label>
			) : null}

			<HeroSearchField.Group>
				<HeroSearchField.SearchIcon />
				<HeroSearchField.Input
					placeholder={placeholder}
					className="w-[120px]"
				/>
				<HeroSearchField.ClearButton />
			</HeroSearchField.Group>
			<FieldError />

			<FieldError />
		</HeroSearchField>
	);
}
