'use client';

interface ReviewFilterBarProps {
    value?: number;
    onChange: (rating?: number) => void;
}

const FILTERS = [
    { label: 'Tất cả', value: undefined },
    { label: '5★', value: 5 },
    { label: '4★', value: 4 },
    { label: '3★', value: 3 },
    { label: '2★', value: 2 },
    { label: '1★', value: 1 },
];

export default function ReviewFilterBar({ value, onChange }: ReviewFilterBarProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
                const isActive = f.value === value;
                return (
                    <button
                        key={f.label}
                        type="button"
                        onClick={() => onChange(f.value)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150 border ${
                            isActive
                                ? 'bg-[#6f4e37] text-white border-[#6f4e37] shadow-sm'
                                : 'bg-white text-[#6f4e37] border-[#e6d8c9] hover:border-[#6f4e37] hover:bg-[#fdf5ef]'
                        }`}
                    >
                        {f.label}
                    </button>
                );
            })}
        </div>
    );
}
