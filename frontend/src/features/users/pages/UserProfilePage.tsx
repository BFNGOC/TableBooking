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
import { IUser } from "@/features/users/types/user-type";
import { userProfileRoleUserFormField } from "@/features/users/constants/user-section-form-field";
import { useCrudMutation } from "@/shared/hooks/useCrudMutation";

const profileFields: FormField[] = userProfileRoleUserFormField;

export default function UserProfilePage() {
	const { data, isLoading } = useGetMe();
	const queryClient = useQueryClient();
	const { showToast } = useToast();

	const [formValues, setFormValues] = useState<Partial<IUser>>({});

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

	const updateMutation = useCrudMutation<{
		_id: string;
		payload: UpdateUserPayload;
	}>({
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

		// PATCH /users/me expects the update payload directly
		updateMutation.mutate(payload as UpdateUserPayload, {
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

	if (isLoading) return <div className="p-6">Đang tải thông tin...</div>;

	return (
		<div className="p-6">
			<CustomCard
				className="mx-auto max-w-4xl"
				headerTitle="Chỉnh sửa thông tin cá nhân"
				subtitle="Cập nhật tên, email, số điện thoại, địa chỉ và ảnh đại diện."
			>
				<CustomForm
					footer={
						<Button
							type="submit"
							color="primary"
							isLoading={
								updateMutation.isPending ||
								updateMutation.isLoading
							}
						>
							Lưu thay đổi
						</Button>
					}
					fields={profileFields.map((f) => ({
						...f,
						col:
							f.col ??
							(f.name === "avatar"
								? 4
								: f.name === "address"
									? 12
									: f.name === "dateOfBirth" ||
										  f.name === "gender" ||
										  f.name === "phone"
										? 6
										: 6),
					}))}
					values={formValues}
					onValuesChange={setFormValues}
					onSubmit={handleSubmit}
					mode="edit"
				/>
			</CustomCard>
		</div>
	);
}
