import { FilterParams } from '@/shared/types/filter-params-type';
import { UserRole } from './user-role';

export interface IUserFilterParams extends FilterParams {
    role: UserRole;
}
