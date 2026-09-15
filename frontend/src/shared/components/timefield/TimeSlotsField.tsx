'use client';

import React from 'react';
import { FormField } from '@/shared/types/form-field';
import { Label, FieldError } from '@heroui/react';

export default function TimeSlotsField({
    label,
    name,
    isRequired,
    isDisabled,
    isReadOnly,
    value,
    onChange,
    options,
    className,
    selectionMode,
}: FormField) {
    const selected = value ?? null;

    const handleClick = (id: any) => {
        if (isDisabled || isReadOnly) return;

        if (selectionMode === 'multiple') {
            const arr = Array.isArray(selected) ? [...selected] : [];
            const idx = arr.indexOf(id);
            if (idx === -1) arr.push(id);
            else arr.splice(idx, 1);
            onChange?.(arr);
        } else {
            onChange?.(id);
        }
    };

    return (
        <div>
            {label ? (
                <Label className="mb-2 text-sm font-medium text-gray-700">{label}</Label>
            ) : null}

            <div className={`grid grid-cols-3 gap-2 ${className ?? ''}`}>
                {(options ?? []).map((opt) => {
                    const id = opt.id ?? opt.text;
                    const text = opt.text ?? String(opt.id);
                    const isSelected =
                        selectionMode === 'multiple'
                            ? Array.isArray(selected) && selected.includes(id)
                            : selected === id;

                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => handleClick(id)}
                            className={`py-3 text-xs font-semibold rounded-xl transition-all duration-200 ${isSelected ? 'bg-[#6f4e37] text-white shadow-sm' : 'bg-[#fcf5ec] text-[#6f4e37] hover:bg-[#f5ebd9] border border-[#f5ebd9]'}`}
                        >
                            {text}
                        </button>
                    );
                })}
            </div>

            <FieldError />
        </div>
    );
}
