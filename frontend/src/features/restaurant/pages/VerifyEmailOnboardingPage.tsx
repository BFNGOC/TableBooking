'use client';

import CustomForm from '@/shared/components/form/CustomForm';
import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    useResendVerifyEmailOnboarding,
    useVerifyEmailOnboarding,
} from '../hooks/useRestaurantRoleCustomer';
import { VerifyPayload } from '@/features/auth/types/auth.type';
import { verifyFormField } from '@/features/auth/constants/verify-form-fields';
import { useRestaurantMe } from '../hooks/useRestaurantMe';
import CountdownResend from '@/shared/components/countdown/CountdownResend';

interface IVerifyProps {
    _id: string;
}

function VerifyEmailOnboardingPage({ _id }: IVerifyProps) {
    const router = useRouter();

    const { mutateAsync: verify, isPending } = useVerifyEmailOnboarding();

    const { mutate: resendVerifyEmailData, isPending: isResending } =
        useResendVerifyEmailOnboarding();

    const { data: getRestaurantMe } = useRestaurantMe();

    const [values, setValues] = useState<Partial<VerifyPayload>>({ _id, code: '' });

    useEffect(() => {
        setValues({ _id, code: values.code ?? '' });
    }, [_id]);

    const handleSubmit = async (payload: Partial<VerifyPayload>) => {
        await verify(payload as VerifyPayload);

        router.push('/restaurant-onboarding/pending');
    };

    const handleResend = async () => {
        resendVerifyEmailData();
    };

    return (
        <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="mb-6">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">Xác thực tài khoản</h1>

                <p className="text-gray-500">
                    Vui lòng xác thực tài khoản để tiếp tục sử dụng hệ thống.
                </p>
            </div>

            <div>
                Mã xác thực đã được gửi đến email: <strong>{getRestaurantMe?.email}</strong>
            </div>

            <div className="space-y-3">
                <CustomForm
                    fields={verifyFormField}
                    values={values}
                    onValuesChange={setValues}
                    onSubmit={handleSubmit}
                    footer={
                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#6f4e37]"
                            isPending={isPending}
                        >
                            Xác thực
                        </Button>
                    }
                />
            </div>

            <div className="mt-4">
                <CountdownResend
                    expiresAt={getRestaurantMe?.verificationCodeExpires}
                    onResend={handleResend || isResending}
                    isResending={isResending}
                />
            </div>
        </div>
    );
}

export default VerifyEmailOnboardingPage;
