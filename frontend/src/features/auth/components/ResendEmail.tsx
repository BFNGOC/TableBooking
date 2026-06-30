'use client';

import { Button } from '@heroui/react';
import ModalCustom from '@/shared/components/modals/ModalCustom';
import Stepper from '@/shared/components/step/Stepper';
import { useStepper } from '@/shared/hooks/useStepper';
import CustomForm from '@/shared/components/form/CustomForm';
import { FormModalModeType } from '@/shared/types/form-modal-mode-type';
import { retryActiveApi, verifyApi } from '../api/auth-api';
import { useToast } from '@/shared/hooks/useToast';
import { useState } from 'react';
import { VerifyPayload } from '../types/auth.type';
import { getEmailField, getOtpField } from '../constants/step-form-field';

interface IResendEmailProps {
    open: boolean;
    close: () => void;
    defaultEmail?: any;
    mode: FormModalModeType;
}

function ResendEmail({ open, close, defaultEmail, mode }: IResendEmailProps) {
    const stepper = useStepper();

    const { showToast } = useToast();

    const [id, setId] = useState<string | null>(null);

    const handleResendOtpStep0 = async () => {
        try {
            if (!defaultEmail) return;

            const res = await retryActiveApi({ email: defaultEmail });

            if (res?.data) {
                showToast('success', 'Gửi OTP thành công', 'Vui lòng kiểm tra email');
                setId(res.data._id);
                stepper.next();
            }
        } catch (error: any) {
            showToast('error', 'Gửi OTP thất bại', error?.message);
        }
    };

    const handleverifyOtpStep1 = async (data: { code: string }) => {
        try {
            if (!id) return;

            const payload: VerifyPayload = {
                _id: id,
                code: data.code,
            };

            const res = await verifyApi(payload);

            if (res?.data) {
                showToast(
                    'success',
                    'Xác thực OTP thành công',
                    'Vui lòng đăng nhập để tiếp tục sử dụng hệ thống'
                );
                stepper.next();
            }
        } catch (error: any) {
            showToast('error', 'Xác thực OTP thất bại', error?.message);
        }
    };

    const steps = [
        {
            title: 'Thông tin',
            description: 'Nhập email',
            content: (
                <CustomForm
                    fields={getEmailField("'Tài khoản của bạn chưa được kích hoạt'")}
                    defaultValues={{ email: defaultEmail }}
                    mode={mode}
                    footer={
                        <div className="flex gap-3">
                            <Button variant="outline" onPress={stepper.previous}>
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
            title: 'OTP',
            description: 'Xác thực',
            content: (
                <CustomForm
                    fields={getOtpField('Nhập mã OTP đã được gửi tới email')}
                    onSubmit={handleverifyOtpStep1}
                    footer={
                        <div className="flex gap-3">
                            <Button variant="outline" onPress={stepper.previous}>
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
            title: 'Hoàn tất',
            description: 'Kích hoạt thành công',
            content: <div>Tài khoản kích hoạt thành công. Vui lòng đăng nhập lại!</div>,
        },
    ];

    const renderFooter = () => {
        switch (stepper.currentStep) {
            case 0:
                return (
                    <>
                        <Button variant="outline" onPress={close}>
                            Hủy
                        </Button>

                        <Button variant="primary" onPress={handleResendOtpStep0}>
                            Nhận mã OTP
                        </Button>
                    </>
                );

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
            title="Kích hoạt tài khoản"
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

export default ResendEmail;
