'use client';

export function UpcomingSkeleton() {
    return <div className="h-[300px] animate-pulse rounded-[28px] bg-[#eee5df]" />;
}

export function RecentSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((item) => (
                <div key={item} className="h-[82px] animate-pulse rounded-2xl bg-[#eee5df]" />
            ))}
        </div>
    );
}
