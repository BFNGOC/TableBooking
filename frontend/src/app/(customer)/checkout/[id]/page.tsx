type Props = {
    params: Promise<{
        id: string;
    }>;
};

async function CheckoutResult({ params }: Props) {
    const { id } = await params;
    return <div>CheckoutResult: {id}</div>;
}

export default CheckoutResult;
