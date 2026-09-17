import Verify from '@/features/auth/pages/Verify';

function VerifyEmailPage({ params }: { params: { id: string } }) {
    const { id } = params;
    return <Verify _id={id} />;
}

export default VerifyEmailPage;
