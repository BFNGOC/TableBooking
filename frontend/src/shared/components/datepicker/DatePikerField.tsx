'use client';

import { FormField } from '@/shared/types/form-field';
import { DatePicker, Label, DateField, Calendar, FieldError } from '@heroui/react';

export default function DatePikerField({
    label,
    name,
    isRequired,
    isDisabled,
    defaultDate,
    minValue,
    className,
}: FormField) {
    return (
        <DatePicker
            className="full"
            name={name}
            defaultValue={defaultDate}
            isDisabled={isDisabled}
            isRequired={isRequired}
            minValue={minValue}
        >
            <Label className="mb-2 text-sm font-medium text-gray-700">{label}</Label>
            <DateField.Group fullWidth className={className}>
                <DateField.Input>
                    {(segment) => <DateField.Segment segment={segment} />}
                </DateField.Input>
                <DateField.Suffix>
                    <DatePicker.Trigger>
                        <DatePicker.TriggerIndicator />
                    </DatePicker.Trigger>
                </DateField.Suffix>
            </DateField.Group>
            <DatePicker.Popover>
                <Calendar aria-label="Event date">
                    <Calendar.Header>
                        <Calendar.YearPickerTrigger>
                            <Calendar.YearPickerTriggerHeading />
                            <Calendar.YearPickerTriggerIndicator />
                        </Calendar.YearPickerTrigger>
                        <Calendar.NavButton slot="previous" />
                        <Calendar.NavButton slot="next" />
                    </Calendar.Header>
                    <Calendar.Grid>
                        <Calendar.GridHeader>
                            {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                        </Calendar.GridHeader>
                        <Calendar.GridBody>
                            {(date) => <Calendar.Cell date={date} />}
                        </Calendar.GridBody>
                    </Calendar.Grid>
                    <Calendar.YearPickerGrid>
                        <Calendar.YearPickerGridBody>
                            {({ year }) => <Calendar.YearPickerCell year={year} />}
                        </Calendar.YearPickerGridBody>
                    </Calendar.YearPickerGrid>
                </Calendar>
            </DatePicker.Popover>

            <FieldError />
        </DatePicker>
    );
}
