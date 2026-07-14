"use client";

import { Skeleton } from "@heroui/react";

export default function SkeletonProfile() {
	return (
		<div className="grid grid-cols-12 gap-5">
			{/* Avatar - full width */}
			<div className="col-span-12 flex justify-center">
				<Skeleton className="h-44 w-44 rounded-xl" />
			</div>

			{/* Name - left */}
			<div className="col-span-6 w-full">
				<Skeleton className="mb-2 h-4 w-20 rounded" />
				<Skeleton className="h-10 rounded" />
			</div>

			{/* Email - right */}
			<div className="col-span-6 w-full">
				<Skeleton className="mb-2 h-4 w-16 rounded" />
				<Skeleton className="h-10 rounded" />
			</div>

			{/* Phone - left */}
			<div className="col-span-6 w-full">
				<Skeleton className="mb-2 h-4 w-24 rounded" />
				<Skeleton className="h-10 rounded" />
			</div>

			{/* DateOfBirth - right */}
			<div className="col-span-6 w-full">
				<Skeleton className="mb-2 h-4 w-20 rounded" />
				<Skeleton className="h-10 rounded" />
			</div>

			{/* Gender - left */}
			<div className="col-span-6 w-full">
				<Skeleton className="mb-2 h-4 w-16 rounded" />
				<Skeleton className="h-10 rounded" />
			</div>

			{/* Empty space - right (to maintain grid) */}
			<div className="col-span-6" />

			{/* Address - full width */}
			<div className="col-span-12 w-full">
				<Skeleton className="mb-2 h-4 w-16 rounded" />
				<Skeleton className="h-10 rounded" />
			</div>
		</div>
	);
}
