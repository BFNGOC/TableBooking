import CheckoutResultPage from '@/features/payment/pages/CheckoutResultPage';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

async function CheckoutResult({ params }: Props) {
    const { id } = await params;

    return <CheckoutResultPage id={id} />;
}

export default CheckoutResult;
