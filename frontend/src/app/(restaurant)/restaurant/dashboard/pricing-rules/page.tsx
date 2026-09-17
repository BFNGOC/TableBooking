import PricingRulePage from '@/features/pricing-rule/pages/PricingRulePage';

export const metadata = {
    title: 'Quản lý Quy tắc Giá | Restaurant Dashboard',
    description: 'Cấu hình phụ thu, giảm giá theo thời gian, ngày lễ hoặc khu vực bàn.',
};

export default function Page() {
    return <PricingRulePage />;
}
