import { ReactNode } from 'react';
import CustomCard from '../../../shared/components/card/CustomCard';

interface InfoValueCardProps {
    label: string;
    value: ReactNode;
    className?: string;
    valueClassName?: string;
    card?: boolean;
}

export default function InfoValueCard({
    label,
    value,
    className = '',
    valueClassName = '',
    card = false,
}: InfoValueCardProps) {
    const content = (
        <div className={`flex justify-between items-center ${className}`.trim()}>
            <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
            <p className={`text-lg font-semibold text-[#1f2937] ${valueClassName}`.trim()}>
                {value ?? '—'}
            </p>
        </div>
    );

    if (card) {
        return <CustomCard>{content}</CustomCard>;
    }

    return <>{content}</>;
}
