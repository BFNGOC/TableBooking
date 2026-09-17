"use client";

import { Pagination } from "@heroui/react";

interface CustomPaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
}

export default function CustomPagination({
	currentPage,
	totalPages,
	onPageChange,
	className,
}: CustomPaginationProps) {
	if (totalPages <= 1) return null;

	const getPageNumbers = (): (number | "ellipsis")[] => {
		const pages: (number | "ellipsis")[] = [];

		pages.push(1);

		if (currentPage > 3) {
			pages.push("ellipsis");
		}

		const start = Math.max(2, currentPage - 1);
		const end = Math.min(totalPages - 1, currentPage + 1);

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		if (currentPage < totalPages - 2) {
			pages.push("ellipsis");
		}

		if (totalPages > 1) {
			pages.push(totalPages);
		}

		return pages;
	};

	return (
		<div
			className={`w-full max-w-2xs overflow-x-auto sm:max-w-full ${className ?? ""}`}
		>
			<Pagination className="justify-center">
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.Previous
							isDisabled={currentPage === 1}
							onPress={() => onPageChange(currentPage - 1)}
						>
							<Pagination.PreviousIcon />
							<span>Previous</span>
						</Pagination.Previous>
					</Pagination.Item>

					{getPageNumbers().map((page, index) =>
						page === "ellipsis" ? (
							<Pagination.Item key={`ellipsis-${index}`}>
								<Pagination.Ellipsis />
							</Pagination.Item>
						) : (
							<Pagination.Item key={page}>
								<Pagination.Link
									isActive={page === currentPage}
									onPress={() => onPageChange(page)}
								>
									{page}
								</Pagination.Link>
							</Pagination.Item>
						),
					)}

					<Pagination.Item>
						<Pagination.Next
							isDisabled={currentPage === totalPages}
							onPress={() => onPageChange(currentPage + 1)}
						>
							<span>Next</span>
							<Pagination.NextIcon />
						</Pagination.Next>
					</Pagination.Item>
				</Pagination.Content>
			</Pagination>
		</div>
	);
}
