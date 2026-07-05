import { MetaPagination } from '@/shared/types/meta-pagination';
import { IUser } from './user-type';

export type UserFindAllPaginationType = {
    data: IUser[];
    meta: MetaPagination;
};
