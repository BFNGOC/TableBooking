'use client';

import CustomForm from '@/shared/components/form/CustomForm';
import { Button } from '@heroui/react';
import { verifyFormField } from '../constants/verify-form-fields';
import { VerifyPayload } from '../types/auth.type';
import { useToast } from '@/shared/hooks/useToast';
import { useRouter } from 'next/navigation';
import { verifyApi } from '../api/auth-api';

interface IVerifyProps {
    _id: string;
}

function Verify({ _id }: IVerifyProps) {
    const router = useRouter();
    const { showToast } = useToast();

    const handleSubmit = async (data: VerifyPayload) => {
        const res = await verifyApi(data);

        if (res?.data) {
            showToast('success', 'Xác thực thành công', 'Bạn có thể đăng nhập ngay bây giờ');
            router.push('/login');
        }
        try {
        } catch (error: any) {
            showToast('error', 'Đăng nhập thất bại', error?.message);
        }
    };
    return (
        <div className="rounded-3xl bg-white p-8 shadow-sm">
            {/* Header */}
            <div className="mb-6">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">Tạo tài khoản</h1>

                <p className="text-gray-500">
                    Đăng ký để khám phá và đặt chỗ tại những nhà hàng tuyệt vời nhất.
                </p>
            </div>

            {/* Form */}
            <div className="space-y-3">
                <CustomForm
                    fields={verifyFormField}
                    defaultValues={{ _id }}
                    onSubmit={handleSubmit}
                    footer={
                        <Button type="submit" className="w-full h-12 bg-[#6f4e37]">
                            Xác thực
                        </Button>
                    }
                ></CustomForm>
            </div>
        </div>
    );
}

export default Verify;
