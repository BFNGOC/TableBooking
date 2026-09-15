"use client";

import { useState } from "react";
import { Pagination } from "@heroui/react";
import { useSession } from "next-auth/react";
import { MessageSquarePlus } from "lucide-react";

import {
	useRestaurantReviews,
	useCreateReview,
	useUpdateReview,
	useDeleteReview,
} from "../hooks/useReview";
import { useFormModal } from "@/shared/hooks/useFormModal";
import { IReview } from "../types/review.type";
import { CreateReviewPayload, UpdateReviewPayload } from "../types/review.dto";

import ReviewCard from "../components/ReviewCard";
import ReviewRatingSummary from "../components/ReviewRatingSummary";
import ReviewFilterBar from "../components/ReviewFilterBar";
import ReviewFormModal from "../components/ReviewFormModal";

interface RestaurantDetailReviewSectionProps {
	restaurantId: string;
	avgRating: number;
}

export default function RestaurantDetailReviewSection({
	restaurantId,
	avgRating,
}: RestaurantDetailReviewSectionProps) {
	const { data: session } = useSession();
	const isLoggedIn = !!session?.user;

	const {
		data,
		pagination,
		filterValues,
		loading,
		handleChangePage,
		handleFilterChange,
		handleFilterSubmit,
		handleDelete,
		deleting,
	} = useRestaurantReviews(restaurantId);

	const modal = useFormModal<IReview>();
	const createMutation = useCreateReview(restaurantId);
	const updateMutation = useUpdateReview(restaurantId);
	const deleteMutation = useDeleteReview(restaurantId);

	// bookingId được set khi customer click "Viết đánh giá" từ bên ngoài
	const [writeBookingId, setWriteBookingId] = useState<string | undefined>();

	const handleFilterRatingChange = (rating?: number) => {
		handleFilterChange({ ...filterValues, rating } as any);
		handleFilterSubmit();
	};

	const handleSubmit = (values: Partial<IReview>) => {
		if (modal.mode === "create") {
			createMutation.mutate(values as CreateReviewPayload, {
				onSuccess: () => {
					modal.close();
					setWriteBookingId(undefined);
				},
			});
		} else if (modal.mode === "edit" && modal.selectedRecord?._id) {
			updateMutation.mutate(
				{
					id: modal.selectedRecord._id,
					body: values as UpdateReviewPayload,
				},
				{ onSuccess: modal.close },
			);
		}
	};

	const handleEdit = (review: IReview) => {
		modal.openEdit(review);
	};

	const handleDeleteReview = (reviewId: string) => {
		deleteMutation.mutate(reviewId);
	};

	const userId = (session?.user as any)?._id ?? (session?.user as any)?.id;

	return (
		<div className="space-y-6">
			{/* Section Header */}
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-bold text-[#3d2a21]">
					Đánh giá từ thực khách
				</h2>
			</div>

			{/* Rating Summary */}
			{pagination.totalItems > 0 && (
				<ReviewRatingSummary
					reviews={data}
					totalItems={pagination.totalItems}
					avgRating={avgRating}
				/>
			)}

			{/* Filter */}
			<ReviewFilterBar
				value={(filterValues as any)?.rating}
				onChange={handleFilterRatingChange}
			/>

			{/* List */}
			{loading ? (
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="h-32 rounded-2xl bg-[#f0e8e0] animate-pulse"
						/>
					))}
				</div>
			) : data.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-[#e6d8c9] bg-[#fdf8f5] py-12 text-center">
					<p className="text-[#a89080] text-sm">
						Chưa có đánh giá nào.
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{data.map((review) => {
						const reviewUserId =
							typeof review.userId === "object"
								? review.userId?._id
								: review.userId;
						const isOwner = !!userId && userId === reviewUserId;
						return (
							<ReviewCard
								key={review._id}
								review={review}
								showActions={isOwner}
								onEdit={handleEdit}
								onDelete={handleDeleteReview}
								isDeleting={deleting}
							/>
						);
					})}
				</div>
			)}

			{/* Pagination */}
			{pagination.totalPages > 1 && (
				<div className="flex justify-center">
					<Pagination size="sm">
						<Pagination.Content>
							<Pagination.Item>
								<Pagination.Previous
									isDisabled={pagination.currentPage === 1}
									onPress={() =>
										handleChangePage(
											pagination.currentPage - 1,
										)
									}
								>
									<Pagination.PreviousIcon />
									Trước
								</Pagination.Previous>
							</Pagination.Item>

							{Array.from(
								{ length: pagination.totalPages },
								(_, i) => i + 1,
							)
								.filter(
									(p) =>
										Math.abs(p - pagination.currentPage) <=
										2,
								)
								.map((p) => (
									<Pagination.Item key={p}>
										<Pagination.Link
											isActive={
												p === pagination.currentPage
											}
											className={
												p === pagination.currentPage
													? "bg-[#6f4e37] text-white font-semibold"
													: "text-gray-600 hover:bg-gray-100"
											}
											onPress={() => handleChangePage(p)}
										>
											{p}
										</Pagination.Link>
									</Pagination.Item>
								))}

							<Pagination.Item>
								<Pagination.Next
									isDisabled={
										pagination.currentPage ===
										pagination.totalPages
									}
									onPress={() =>
										handleChangePage(
											pagination.currentPage + 1,
										)
									}
								>
									Sau
									<Pagination.NextIcon />
								</Pagination.Next>
							</Pagination.Item>
						</Pagination.Content>
					</Pagination>
				</div>
			)}

			{/* Review Form Modal */}
			<ReviewFormModal
				isOpen={modal.open}
				mode={modal.mode}
				values={modal.selectedRecord}
				onValuesChange={modal.setSelectedRecord as any}
				onSubmit={handleSubmit}
				onClose={() => {
					modal.close();
					setWriteBookingId(undefined);
				}}
				isPending={createMutation.isPending || updateMutation.isPending}
				bookingId={writeBookingId}
			/>
		</div>
	);
}
