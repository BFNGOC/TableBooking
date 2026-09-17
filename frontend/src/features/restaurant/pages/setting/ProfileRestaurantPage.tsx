'use client';

import { useEffect, useState } from 'react';

import CustomForm from '@/shared/components/form/CustomForm';
import PageHeader from '@/shared/components/layouts/PageHeader';
import CustomCard from '@/shared/components/card/CustomCard';

import { Button, Form, Skeleton } from '@heroui/react';

import {
    basicInformationRestaurant,
    businessInformationRestaurant,
    contactInformationRestaurant,
    mediaRestaurant,
    operatingHoursRestaurant,
    socialInformationRestaurant,
} from '../../constants/restaurant-form-field';

import { useCuisineTypes } from '../../hooks/useCuisineTypes';

import { useRestaurantMe, useUpdateRestaurantProfile } from '../../hooks/useRestaurantMe';

import { useToast } from '@/shared/hooks/useToast';

import { Clock, Contact, DiamondPercent, Globe, ImageMinus, Info } from 'lucide-react';

import { UpdateRestaurantProfilePayload } from '../../types/restaurant.dto';

import { RestaurantProfileFormValues } from '../../types/restaurant-profile.types';
import {
    formValuesToSocialLinks,
    isRestaurantProfileChanged,
    restaurantToFormValues,
    timeFormValueToString,
} from '../../utils/restaurant-profile.utils';

function ProfileRestaurantPage() {
    /**
     * ============================================================
     * DATA
     * ============================================================
     */

    const { data: cuisineOptions } = useCuisineTypes();

    const { data: restaurant, isLoading: isRestaurantLoading } = useRestaurantMe();

    /**
     * ============================================================
     * MUTATION
     * ============================================================
     */

    const { mutate: updateRestaurantProfile, isPending: isUpdating } = useUpdateRestaurantProfile();

    /**
     * ============================================================
     * TOAST
     * ============================================================
     */

    const { showToast } = useToast();

    /**
     * ============================================================
     * FORM STATE
     * ============================================================
     */

    const [values, setValues] = useState<RestaurantProfileFormValues>({});

    const [initialValues, setInitialValues] = useState<RestaurantProfileFormValues>({});

    /**
     * ============================================================
     * LOAD RESTAURANT
     * ============================================================
     */

    useEffect(() => {
        if (!restaurant) return;

        const formValues = restaurantToFormValues(restaurant);

        setValues(formValues);

        setInitialValues(formValues);
    }, [restaurant]);

    /**
     * ============================================================
     * CHECK FORM CHANGED
     * ============================================================
     */

    const isChanged = isRestaurantProfileChanged(values, initialValues);

    /**
     * ============================================================
     * HANDLE FORM CHANGE
     * ============================================================
     */

    const handleValuesChange = (newValues: Partial<RestaurantProfileFormValues>) => {
        setValues((prev) => ({
            ...prev,
            ...newValues,
        }));
    };

    /**
     * ============================================================
     * SUBMIT
     * ============================================================
     */

    const handleSubmit = () => {
        /**
         * Không có thay đổi
         */
        if (!isChanged) {
            return;
        }

        /**
         * Tách các field chỉ dùng cho FORM
         */
        const {
            facebook,
            instagram,
            tiktok,
            website,

            openingTime,
            closingTime,

            ...restValues
        } = values;

        /**
         * Validate price
         */
        if (
            restValues.priceFrom !== undefined &&
            restValues.priceFrom !== null &&
            restValues.priceTo !== undefined &&
            restValues.priceTo !== null &&
            restValues.priceTo < restValues.priceFrom
        ) {
            showToast(
                'error',
                'Mức giá không hợp lệ',
                'Mức giá tối đa phải lớn hơn hoặc bằng mức giá tối thiểu'
            );

            return;
        }

        /**
         * Tạo payload BE
         */
        const payload: UpdateRestaurantProfilePayload = {
            ...restValues,

            /**
             * TimePicker
             *
             * {
             *   hour: 8,
             *   minute: 30
             * }
             *
             * ->
             *
             * "08:30"
             */
            openingTime: timeFormValueToString(openingTime),

            closingTime: timeFormValueToString(closingTime),

            /**
             * Social
             *
             * facebook
             * instagram
             * tiktok
             * website
             *
             * ->
             *
             * socialLinks[]
             */
            socialLinks: formValuesToSocialLinks({
                facebook,
                instagram,
                tiktok,
                website,
            }),
        };

        updateRestaurantProfile(payload, {
            onSuccess: () => {
                setInitialValues(values);
            },
        });
    };

    /**
     * ============================================================
     * LOADING
     * ============================================================
     */

    if (isRestaurantLoading) {
        return (
            <div className="flex h-full min-h-0 flex-col">
                <PageHeader
                    title="Thiết lập nhà hàng"
                    subtitle="Quản lý danh tính và thông tin hiển thị của nhà hàng"
                />

                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto py-4">
                    <Skeleton className="h-48 w-full rounded-xl" />

                    <Skeleton className="h-48 w-full rounded-xl" />

                    <div className="grid grid-cols-12 gap-4">
                        <Skeleton className="col-span-8 h-48 rounded-xl" />

                        <Skeleton className="col-span-4 h-48 rounded-xl" />
                    </div>

                    <Skeleton className="h-64 w-full rounded-xl" />

                    <Skeleton className="h-48 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    /**
     * ============================================================
     * RENDER
     * ============================================================
     */

    return (
        <div className="flex h-full min-h-0 flex-col">
            <PageHeader
                title="Thiết lập nhà hàng"
                subtitle="Quản lý danh tính và thông tin hiển thị của nhà hàng"
                extra={
                    <Button
                        className="bg-[#6f4e37] text-white"
                        onPress={handleSubmit}
                        isDisabled={!isChanged || isUpdating}
                        isPending={isUpdating}
                    >
                        {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                }
            />

            <div className="min-h-0 flex-1 overflow-y-auto py-4">
                <Form className="space-y-4">
                    {/* BASIC */}

                    <CustomCard
                        headerTitle={
                            <div className="flex items-center gap-1">
                                <Info size={18} />
                                Thông tin cơ bản
                            </div>
                        }
                    >
                        <CustomForm
                            fields={basicInformationRestaurant(cuisineOptions)}
                            values={values}
                            onValuesChange={handleValuesChange}
                            renderForm={false}
                        />
                    </CustomCard>

                    {/* CONTACT */}

                    <CustomCard
                        headerTitle={
                            <div className="flex items-center gap-1">
                                <Contact size={18} />
                                Thông tin liên hệ
                            </div>
                        }
                    >
                        <CustomForm
                            fields={contactInformationRestaurant}
                            values={values}
                            onValuesChange={handleValuesChange}
                            renderForm={false}
                        />
                    </CustomCard>

                    {/* BUSINESS + OPERATING */}

                    <div className="grid grid-cols-12 gap-4">
                        <CustomCard
                            className="col-span-8"
                            headerTitle={
                                <div className="flex items-center gap-1">
                                    <DiamondPercent size={18} />
                                    Thông tin nhà hàng
                                </div>
                            }
                        >
                            <CustomForm
                                fields={businessInformationRestaurant}
                                values={values}
                                onValuesChange={handleValuesChange}
                                renderForm={false}
                            />
                        </CustomCard>

                        <CustomCard
                            className="col-span-4"
                            headerTitle={
                                <div className="flex items-center gap-1">
                                    <Clock size={18} />
                                    Thời gian mở cửa
                                </div>
                            }
                        >
                            <CustomForm
                                fields={operatingHoursRestaurant}
                                values={values}
                                onValuesChange={handleValuesChange}
                                renderForm={false}
                            />

                            <div className="mt-4 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-800">
                                * Khách hàng có thể đặt bàn muộn nhất 1 tiếng trước khi đóng cửa
                            </div>
                        </CustomCard>
                    </div>

                    {/* MEDIA */}

                    <CustomCard
                        headerTitle={
                            <div className="flex items-center gap-1">
                                <ImageMinus size={18} />
                                Hình ảnh
                            </div>
                        }
                    >
                        <CustomForm
                            fields={mediaRestaurant}
                            values={values}
                            onValuesChange={handleValuesChange}
                            renderForm={false}
                        />
                    </CustomCard>

                    {/* SOCIAL */}

                    <CustomCard
                        headerTitle={
                            <div className="flex items-center gap-1">
                                <Globe size={18} />
                                Mạng xã hội
                            </div>
                        }
                    >
                        <CustomForm
                            fields={socialInformationRestaurant}
                            values={values}
                            onValuesChange={handleValuesChange}
                            renderForm={false}
                        />
                    </CustomCard>
                </Form>
            </div>
        </div>
    );
}

export default ProfileRestaurantPage;
