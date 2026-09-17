'use client';

import CustomForm from '@/shared/components/form/CustomForm';
import { Button } from '@heroui/react';
import { verifyFormField } from '../constants/verify-form-fields';
import { VerifyPayload } from '../types/auth.type';
import { useToast } from '@/shared/hooks/useToast';
import { useRouter } from 'next/navigation';
import { useVerifyMutation } from '../hooks/useAuthMutations';
import { useEffect, useState } from 'react';

interface IVerifyProps {
    _id: string;
}

function Verify({ _id }: IVerifyProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const { mutateAsync: verify, isPending } = useVerifyMutation();
    const [values, setValues] = useState<Partial<VerifyPayload>>({ _id, code: '' });

    useEffect(() => {
        setValues({ _id, code: values.code ?? '' });
    }, [_id]);

    const handleSubmit = async (data: Partial<VerifyPayload>) => {
        const payload: VerifyPayload = {
            _id: data._id ?? _id,
            code: data.code ?? '',
        };

        try {
            const res = await verify(payload);

            if (res?.data) {
                showToast('success', 'Xác thực thành công', 'Bạn có thể đăng nhập ngay bây giờ');
                router.push('/login');
            }
        } catch (error: any) {
            showToast('error', 'Đăng nhập thất bại', error?.message);
        }
    };

    return (
        <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="mb-6">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">Xác thực tài khoản</h1>

                <p className="text-gray-500">
                    Vui lòng xác thực tài khoản để tiếp tục sử dụng hệ thống.
                </p>
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
        </div>
    );
}

export default Verify;
