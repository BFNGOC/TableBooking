'use client';

import { useRouter } from 'next/navigation';
import { RestaurantOnboardingPayload } from '../types/restaurant.dto';
import { useState } from 'react';
import CustomForm from '@/shared/components/form/CustomForm';
import { Button } from '@heroui/react';
import { createOnboardingFormField } from '../constants/onboarding-form-field';
import { useCuisineTypes } from '../hooks/useCuisineTypes';
import { useOnboarding } from '../hooks/useRestaurantOnboarding';

function RestaurantOnboardingPage() {
    const router = useRouter();

    const { data: cuisineTypes } = useCuisineTypes();

    const { mutateAsync: onboarding, isPending } = useOnboarding();

    const [values, setValues] = useState<Partial<RestaurantOnboardingPayload>>({});

    const handleSubmit = async (payload: Partial<RestaurantOnboardingPayload>) => {
        const res = await onboarding(payload as RestaurantOnboardingPayload);

        router.push(`/restaurant-onboarding/verify-email/${res._id}`);
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
                            isPending={isPending}
                        >
                            Gửi yêu cùa hợp tác
                        </Button>
                    }
                />
            </div>
        </div>
    );
}

export default RestaurantOnboardingPage;
