import DiscoverTablePage from '@/features/booking/page/customer/DiscoverTablePage';

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

async function DiscoverTable({ params }: Props) {
    const { slug } = await params;
    return <DiscoverTablePage slug={slug} />;
}

export default DiscoverTable;
