import CustomerHomePage from '@/features/(customer)/home/CustomerHomePage';
import { IUser } from '@/features/users/types/user-type';
import { serverRequest } from '@/shared/library/axios/server-api';

export default async function Home() {
    // const res = await serverRequest<IUser>({ url: `/users/me`, method: 'GET' });

    // console.log(res);

    return (
        <div>
            <CustomerHomePage />
        </div>
    );
}
