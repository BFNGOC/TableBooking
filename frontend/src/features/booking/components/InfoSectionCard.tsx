import { ReactNode } from 'react';

interface InfoSectionCardProps {
    title: string;
    children: ReactNode;
    className?: string;
}

export default function InfoSectionCard({ title, children, className = '' }: InfoSectionCardProps) {
    return (
        <div className={`${className}`.trim()}>
            <h3 className="text-lg font-semibold text-[#1f2937]">{title}</h3>
            {children}
        </div>
    );
}
