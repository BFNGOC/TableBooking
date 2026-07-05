import { FilterParams } from '@/shared/types/filter-params-type';
import { UserRole } from './user-role';

export interface UserFilterParams extends FilterParams {
    role?: UserRole;
    isActive?: boolean;
}
