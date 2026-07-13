'use client';

import { useRouter } from 'next/navigation';
import { RestaurantOnboardingPayload } from '../types/restaurant.dto';
import { useToast } from '@/shared/hooks/useToast';
import { useState } from 'react';
import CustomForm from '@/shared/components/form/CustomForm';
import { Button } from '@heroui/react';
import { createOnboardingFormField } from '../constants/onboarding-form-field';
import { useCuisineTypes } from '../hooks/useCuisineTypes';

function RestaurantOnboardingPage() {
    const router = useRouter();
    const { showToast } = useToast();
    // const { mutateAsync: register, isPending } = useRegisterMutation();

    const { data: cuisineTypes } = useCuisineTypes();

    const [values, setValues] = useState<Partial<RestaurantOnboardingPayload>>({});

    const handleSubmit = async (data: Partial<RestaurantOnboardingPayload>) => {
        try {
            // const res = await register(payload);
            // if (res?.data?.user?._id) {
            //     showToast(
            //         'success',
            //         'Đăng ký thành công',
            //         'Vui lòng kiểm tra email để xác nhận tài khoản của bạn'
            //     );
            //     router.push(`/verify-email/${res.data.user._id}`);
            // }
        } catch (error: any) {
            showToast('error', 'Đăng ký nhà hàng thất bại', error?.message);
        }
    };

    return (
        <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="mb-6">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">Bắt đầu hành trình</h1>

                <p className="text-gray-500">
                    Vui lòng để lại thông tin, chúng tôi sẽ liên hệ tư vấn trong vòng 24h.
                </p>
            </div>

            <div className="space-y-3">
                <CustomForm
                    fields={createOnboardingFormField(cuisineTypes ?? [])}
                    values={values}
                    onValuesChange={setValues}
                    onSubmit={handleSubmit}
                    footer={
                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#6f4e37]"
                            // isPending={isPending}
                        >
                            Đăng ký
                        </Button>
                    }
                />
            </div>
        </div>
    );
}

export default RestaurantOnboardingPage;
