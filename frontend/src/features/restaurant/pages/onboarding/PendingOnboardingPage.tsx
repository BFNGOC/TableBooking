'use client';

import { Clock3, CircleX, Eye, Home, RefreshCcw, CheckCircle2 } from 'lucide-react';

import { Button, Card, Separator } from '@heroui/react';

import Link from 'next/link';
import ModalFormTabs, { FormSection } from '@/shared/components/modals/ModalFormTabs';
import { useFormModal } from '@/shared/hooks/useFormModal';
import { useRestaurantMe } from '../../hooks/useRestaurantMe';
import { IRestaurant, RestaurantVerifyStatus } from '../../types/restaurant.type';
import { useCuisineTypes } from '../../hooks/useCuisineTypes';
import { createOnboardingFormField } from '../../constants/onboarding-form-field';
import { signOut } from 'next-auth/react';
import { useUpdateOnboarding } from '../../hooks/useRestaurantOnboarding';

function PendingOnboardingPage() {
    const { data: restaurantMe } = useRestaurantMe();

    const { open, mode, selectedRecord, setSelectedRecord, openView, openEdit, close } =
        useFormModal<IRestaurant>();

    const updateMutation = useUpdateOnboarding();

    const { data: cuisineTypes } = useCuisineTypes();

    const isRejected = restaurantMe?.verifyStatus === 'REJECTED';

    const restaurantSections: FormSection[] = [
        {
            key: 'restaurantInfo',
            title: 'Thông tin nhà hàng',
            fields: createOnboardingFormField(cuisineTypes ?? []),
        },
    ];

    const handleReLogin = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    const handleSubmitRestaurant = async (values: Partial<IRestaurant>) => {
        const res = await updateMutation.mutateAsync(values);
        if (res) close();
    };

    if (restaurantMe?.verifyStatus === RestaurantVerifyStatus.APPROVED) {
        return (
            <div className="flex items-center justify-center bg-default-50 min-h-[80vh]">
                <div className="w-full max-w-xl text-center px-4">
                    <div className="mb-8 flex justify-center">
                        <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white shadow-lg border border-success-100">
                            <CheckCircle2 className="h-14 w-14 text-success animate-bounce" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold text-success-700">
                        Chúc mừng! Hồ sơ đã được duyệt
                    </h1>

                    <p className="mx-auto mt-4 max-w-md text-default-600">
                        Tài khoản của bạn đã nâng cấp thành công lên quyền **Quản lý nhà hàng**. Vui
                        lòng bấm nút bên dưới để đăng xuất và đăng nhập lại nhằm kích hoạt không
                        gian làm việc mới.
                    </p>

                    <Card className="mx-auto mt-8 max-w-sm border border-success-200 bg-success-50/50">
                        <Card.Content className="p-4">
                            <p className="text-xs uppercase tracking-widest text-success-600 font-medium">
                                Đối tác nhà hàng
                            </p>
                            <p className="text-lg font-bold text-success-800 mt-1">
                                {restaurantMe?.restaurantName || 'TableSpot Partner'}
                            </p>
                        </Card.Content>
                    </Card>

                    <div className="mt-8 flex justify-center">
                        <Button
                            variant="danger-soft"
                            size="lg"
                            className="font-semibold text-white shadow-md w-full max-w-xs bg-success"
                            onPress={handleReLogin}
                        >
                            Đăng nhập lại ngay
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

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
                            Chỉnh sửa hồ sơ
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
                isPending={updateMutation.isPending}
            />
        </div>
    );
}

export default PendingOnboardingPage;
