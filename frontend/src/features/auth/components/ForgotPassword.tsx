"use client";

import CustomForm from "@/shared/components/form/CustomForm";
import ModalCustom from "@/shared/components/modals/ModalCustom";
import Stepper from "@/shared/components/step/Stepper";
import { useStepper } from "@/shared/hooks/useStepper";
import { useToast } from "@/shared/hooks/useToast";
import {
	changePasswordField,
	getEmailField,
} from "../constants/step-form-field";
import { Button } from "@heroui/react";
import { changePasswordApi, retryPasswordApi } from "../api/auth-api";
import { useEffect, useState } from "react";
import { ChangePasswordPayload } from "../types/auth.type";

interface IForgotPasswordProps {
	open: boolean;
	close: () => void;
	mode?: "forgot" | "change";
	defaultEmail?: string;
}

function ForgotPassword({
	open,
	close,
	mode = "forgot",
	defaultEmail,
}: IForgotPasswordProps) {
	const stepper = useStepper();

	const { showToast } = useToast();

	const [email, setEmail] = useState<string | null>(defaultEmail ?? null);
	const [emailValues, setEmailValues] = useState<Partial<{ email: string }>>({
		email: defaultEmail ?? "",
	});
	const [passwordValues, setPasswordValues] = useState<
		Partial<ChangePasswordPayload>
	>({
		code: "",
		password: "",
		confirmPassword: "",
	});

	useEffect(() => {
		if (defaultEmail) {
			setEmail(defaultEmail);
			setEmailValues({ email: defaultEmail });
		}
	}, [defaultEmail]);

	const handleResendOtpStep0 = async (data: Partial<{ email: string }>) => {
		const payloadEmail =
			mode === "change"
				? (defaultEmail ?? data.email ?? "")
				: (data.email ?? "");

		try {
			const res = await retryPasswordApi({ email: payloadEmail });

			if (res?.data) {
				showToast(
					"success",
					"Gửi OTP thành công",
					"Vui lòng kiểm tra email",
				);
				setEmail(res.data.email);
				stepper.next();
			}
		} catch (error: any) {
			showToast("error", "Gửi OTP thất bại", error?.message);
		}
	};

	const handleverifyOtpStep1 = async (
		data: Partial<ChangePasswordPayload>,
	) => {
		try {
			const password = data.password ?? "";
			const confirmPassword = data.confirmPassword ?? "";
			if (!email) return;

			if (password !== confirmPassword) {
				showToast(
					"error",
					"Xác nhận mật khẩu thất bại",
					"Xác nhận mật khẩu phải trùng khớp với mật khẩu.",
				);
				return;
			}

			const res = await changePasswordApi({
				email,
				code: data.code ?? "",
				password,
				confirmPassword,
			});

			if (res?.data) {
				showToast(
					"success",
					"Đổi mật khẩu thành công",
					mode === "change"
						? "Mật khẩu của bạn đã được cập nhật thành công."
						: "Vui lòng đăng nhập để tiếp tục sử dụng hệ thống",
				);
				stepper.next();
			}
		} catch (error: any) {
			showToast("error", "Đổi mật khẩu thất bại", error?.message);
		}
	};

	const steps = [
		{
			title: "Thông tin",
			description: mode === "change" ? "Email tài khoản" : "Nhập email",
			content: (
				<CustomForm
					fields={getEmailField(
						mode === "change"
							? "Email tài khoản của bạn"
							: "Để thực hiện thay đổi mật khẩu, vui lòng nhập email tài khoản của bạn.",
					).map((field) => ({
						...field,
						isDisabled: mode === "change",
					}))}
					values={emailValues}
					onValuesChange={setEmailValues}
					onSubmit={handleResendOtpStep0}
					footer={
						<div className="flex gap-3">
							<Button variant="outline" onPress={close}>
								Hủy
							</Button>

							<Button variant="primary" type="submit">
								Gửi mã OTP
							</Button>
						</div>
					}
				/>
			),
		},
		{
			title: "OTP",
			description: "Xác thực",
			content: (
				<CustomForm
					fields={changePasswordField}
					values={passwordValues}
					onValuesChange={setPasswordValues}
					onSubmit={handleverifyOtpStep1}
					footer={
						<div className="flex gap-3">
							<Button
								variant="outline"
								onPress={stepper.previous}
							>
								Quay lại
							</Button>

							<Button variant="primary" type="submit">
								Xác thực
							</Button>
						</div>
					}
				/>
			),
		},
		{
			title: "Hoàn tất",
			description: "Đổi mật khẩu thành công",
			content: (
				<div>
					<p>
						{mode === "change"
							? "Mật khẩu của bạn đã được cập nhật thành công."
							: "Mật khẩu của bạn đã đổi thành công, vui lòng đăng nhập để tiếp tục sử dụng hệ thống!"}
					</p>
				</div>
			),
		},
	];

	const renderFooter = () => {
		switch (stepper.currentStep) {
			case 2:
				return (
					<Button variant="primary" onPress={close}>
						Đóng
					</Button>
				);

			default:
				return null;
		}
	};

	return (
		<ModalCustom
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) close();
			}}
			isDismissable={false}
			title={mode === "change" ? "Đổi mật khẩu" : "Quên mật khẩu"}
			footer={renderFooter()}
		>
			<Stepper
				steps={steps}
				currentStep={stepper.currentStep}
				onStepChange={stepper.goTo}
				clickable={false}
			/>
		</ModalCustom>
	);
}

export default ForgotPassword;
