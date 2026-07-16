'use client';

import { Clock3, CircleX, Eye, Home, RefreshCcw } from 'lucide-react';

import { Button, Card, Separator } from '@heroui/react';

import { useRestaurantMe } from '../hooks/useRestaurantMe';
import Link from 'next/link';
import ModalFormTabs, { FormSection } from '@/shared/components/modals/ModalFormTabs';
import { IRestaurant } from '../types/restaurant.type';
import { useFormModal } from '@/shared/hooks/useFormModal';
import { createOnboardingFormField } from '../constants/onboarding-form-field';
import { useCuisineTypes } from '../hooks/useCuisineTypes';

function PendingOnboardingPage() {
    const { data: restaurantMe } = useRestaurantMe();

    const { open, mode, selectedRecord, setSelectedRecord, openView, openEdit, close } =
        useFormModal<IRestaurant>();

    const { data: cuisineTypes } = useCuisineTypes();

    const isRejected = restaurantMe?.verifyStatus === 'REJECTED';

    const restaurantSections: FormSection[] = [
        {
            key: 'restaurantInfo',
            title: 'Thông tin nhà hàng',
            fields: createOnboardingFormField(cuisineTypes ?? []),
        },
    ];

    const handleSubmitRestaurant = (values: Partial<IRestaurant>) => {
        console.log('Submit restaurant values:', values);
    };

    return (
        <div className="flex items-center justify-center bg-default-50">
            <div className="w-full max-w-3xl">
                <div className="mb-8 flex justify-center">
                    <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white shadow-lg">
                        {isRejected ? (
                            <CircleX className="h-12 w-12 text-danger" />
                        ) : (
                            <Clock3 className="h-12 w-12 text-warning" />
                        )}
                    </div>
                </div>

                <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground">
                        {isRejected
                            ? 'Hồ sơ của bạn chưa được phê duyệt'
                            : 'Hồ sơ của bạn đang được phê duyệt'}
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-default-500">
                        {isRejected
                            ? 'Hồ sơ đăng ký của bạn cần được chỉnh sửa trước khi gửi xét duyệt lại.'
                            : 'Cảm ơn bạn đã đăng ký trở thành đối tác của TableSpot. Chúng tôi sẽ xem xét hồ sơ và phản hồi trong thời gian sớm nhất.'}
                    </p>
                </div>

                <Card className="mx-auto mt-10 max-w-2xl">
                    <Card.Content>
                        <div className="flex flex-col gap-6 md:flex-row md:items-center p-3">
                            <div className="flex flex-1 items-center gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-default-500">
                                        Nhà hàng của bạn
                                    </p>

                                    <p className="text-xl font-semibold">
                                        {restaurantMe?.restaurantName}
                                    </p>
                                </div>
                            </div>

                            <Separator orientation="vertical" className="hidden h-12 md:block" />

                            <div className="text-left md:text-right">
                                <p className="text-xs uppercase tracking-widest text-default-500">
                                    Mã nhà hàng
                                </p>

                                <p className="text-xl font-bold">#{restaurantMe?.restaurantCode}</p>
                            </div>
                        </div>

                        {isRejected && restaurantMe?.verifyNote && (
                            <>
                                <Separator className="my-5" />

                                <div>
                                    <p className="mb-2 font-semibold text-danger">Lý do từ chối</p>

                                    <p className="rounded-xl bg-danger-50 p-4 text-danger">
                                        {restaurantMe.verifyNote}
                                    </p>
                                </div>
                            </>
                        )}
                    </Card.Content>
                </Card>

                <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <Button className="bg-[#6f4e37]">
                        <Home size={18} />
                        <Link href="/">Về trang chủ</Link>
                    </Button>

                    {!isRejected && (
                        <Button
                            variant="danger-soft"
                            onPress={() => openView(restaurantMe as IRestaurant)}
                        >
                            <Eye size={18} />
                            Xem lại thông tin đã gửi
                        </Button>
                    )}

                    {isRejected && (
                        <Button
                            variant="danger-soft"
                            onPress={() => openEdit(restaurantMe as IRestaurant)}
                        >
                            <RefreshCcw size={18} />
                            <Link href="/restaurant/onboarding">Chỉnh sửa hồ sơ</Link>
                        </Button>
                    )}
                </div>
            </div>

            <ModalFormTabs<IRestaurant>
                isOpen={open}
                title={({ mode }) =>
                    mode === 'view' ? 'Xem thông tin nhà hàng' : 'Chỉnh sửa thông tin nhà hàng'
                }
                mode={mode}
                values={selectedRecord ?? {}}
                onValuesChange={(values) => setSelectedRecord(values as IRestaurant)}
                sections={restaurantSections}
                onClose={close}
                onSubmit={handleSubmitRestaurant}
                // isPending={updateMutation.isPending || uploadMutation.isPending}
            />
        </div>
    );
}

export default PendingOnboardingPage;
