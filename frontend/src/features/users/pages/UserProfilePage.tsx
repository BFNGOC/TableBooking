"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import CustomCard from "@/shared/components/card/CustomCard";
import { useQueryClient } from "@tanstack/react-query";
import { UpdateUserPayload } from "../types/user-payload";
import CustomForm from "@/shared/components/form/CustomForm";
import { formatSectionFormValues } from "@/shared/utils/format-section-form-values";
import { FormField } from "@/shared/types/form-field";
import { useToast } from "@/shared/hooks/useToast";
import { useGetMe } from "@/features/users/hooks/useGetMe";
import { userRoleUserApi } from "@/features/users/api/user-api";
import { userQueryKeys } from "@/features/users/constants/query-key";
import SkeletonProfile from "@/features/users/components/SkeletonProfile";
import { IUser } from "@/features/users/types/user-type";
import { userProfileRoleUserFormField } from "@/features/users/constants/user-section-form-field";
import { useCrudMutation } from "@/shared/hooks/useCrudMutation";
import ForgotPassword from "@/features/auth/components/ForgotPassword";

const profileFields: FormField[] = userProfileRoleUserFormField;

export default function UserProfilePage() {
	const { data, isLoading } = useGetMe();
	const queryClient = useQueryClient();
	const { showToast } = useToast();

	const [formValues, setFormValues] = useState<Partial<IUser>>({});
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

	const resetFormValues = () => {
		if (data) {
			setFormValues({
				...data,
				dateOfBirth: data.dateOfBirth
					? new Date(data.dateOfBirth).toISOString().slice(0, 10)
					: "",
			});
		} else {
			setFormValues({});
		}
	};

	useEffect(() => {
		if (data) {
			setFormValues({
				...data,
				dateOfBirth: data.dateOfBirth
					? new Date(data.dateOfBirth).toISOString().slice(0, 10)
					: "",
			});
		}
	}, [data]);

	const updateMutation = useCrudMutation<UpdateUserPayload>({
		queryKey: userQueryKeys.ME,
		api: userRoleUserApi.update,
	});

	const handleSubmit = (values: Partial<IUser>) => {
		const userSections = [
			{
				key: "profile",
				title: "Thông tin",
				fields: profileFields,
			},
		];

		const payload = formatSectionFormValues(values, userSections, "toApi");

		updateMutation.mutate(payload, {
			onSuccess: (res: any) => {
				showToast(
					"success",
					"Cập nhật thông tin thành công",
					res?.message ?? "Thông tin đã được cập nhật",
				);
			},

			onError: (error: any) => {
				showToast(
					"error",
					"Cập nhật thất bại",
					error?.response?.data?.message ?? "Đã có lỗi xảy ra",
				);
			},
		});
	};
	return (
		<div className="p-6">
			<CustomCard
				className="mx-auto max-w-4xl"
				headerTitle="Chỉnh sửa thông tin cá nhân"
				subtitle="Cập nhật tên, email, số điện thoại, địa chỉ và ảnh đại diện."
			>
				{" "}
				{data?.accountType === "LOCAL" && (
					<div className="mb-4 flex justify-start">
						<Button
							variant="primary"
							onPress={() => setIsPasswordModalOpen(true)}
						>
							Đổi mật khẩu
						</Button>
					</div>
				)}
				{isLoading ? (
					<SkeletonProfile />
				) : (
					<CustomForm
						footer={
							<div className=" w-full flex justify-end gap-4">
								<Button
									type="button"
									variant="outline"
									onPress={resetFormValues}
								>
									Hủy
								</Button>

								<Button
									type="submit"
									variant="primary"
									isPending={updateMutation.isPending}
								>
									Lưu thay đổi
								</Button>
							</div>
						}
						fields={profileFields}
						values={formValues}
						onValuesChange={setFormValues}
						onSubmit={handleSubmit}
						mode="edit"
					/>
				)}
			</CustomCard>

			<ForgotPassword
				open={isPasswordModalOpen}
				close={() => setIsPasswordModalOpen(false)}
				mode="change"
				defaultEmail={data?.email}
			/>
		</div>
	);
}
