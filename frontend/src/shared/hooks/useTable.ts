import { useState } from 'react';
import { useQuery, type QueryKey } from '@tanstack/react-query';

import { DEFAULT_PAGINATION } from '../constants/default-pagination';

import { useCrudMutation } from './useCrudMutation';
import { useToast } from './useToast';

interface PaginationResponse {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
}

interface UseTableProps<P> {
    queryKey: QueryKey;

    fetchApi: (params: P) => Promise<any>;

    removeApi?: (id: string) => Promise<any>;

    activeApi?: (id: string) => Promise<any>;

    inactiveApi?: (id: string) => Promise<any>;

    initialFilters?: Partial<P>;
}

const useTable = <T, P>({
    queryKey,
    fetchApi,
    removeApi,
    activeApi,
    inactiveApi,
    initialFilters = {},
}: UseTableProps<P>) => {
    const { showToast } = useToast();

    const [filterValues, setFilterValues] = useState<Partial<P>>(initialFilters);

    const [params, setParams] = useState<P>({
        currentPage: DEFAULT_PAGINATION.currentPage,
        pageSize: DEFAULT_PAGINATION.pageSize,
        ...initialFilters,
    } as P);

    const {
        data: response,
        isPending,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: [...queryKey, params],

        queryFn: () => fetchApi(params),

        placeholderData: (previous) => previous,
    });

    /**
     * Data
     */
    const data: T[] = response?.data ?? [];

    const pagination: PaginationResponse = response?.meta ?? {
        currentPage: DEFAULT_PAGINATION.currentPage,
        totalPages: 1,
        totalItems: 0,
        pageSize: DEFAULT_PAGINATION.pageSize,
    };

    const handleParamsChange = (values: Partial<P>) => {
        setParams((prev) => ({
            ...prev,
            ...values,
            currentPage: DEFAULT_PAGINATION.currentPage,
        }));
    };

    /**
     * Filter
     */
    const handleFilterChange = (values: Partial<P>) => {
        setFilterValues(values);
    };

    const handleFilterSubmit = () => {
        setParams((prev) => ({
            ...prev,
            ...filterValues,
            currentPage: DEFAULT_PAGINATION.currentPage,
        }));
    };

    const handleFilterReset = () => {
        setFilterValues(initialFilters);

        setParams({
            currentPage: DEFAULT_PAGINATION.currentPage,
            pageSize: DEFAULT_PAGINATION.pageSize,
            ...initialFilters,
        } as P);
    };

    /**
     * Pagination
     */
    const handleChangePage = (page: number) => {
        setParams((prev) => ({
            ...prev,
            currentPage: page,
        }));
    };

    const handleChangePageSize = (pageSize: number) => {
        setParams((prev) => ({
            ...prev,
            currentPage: DEFAULT_PAGINATION.currentPage,
            pageSize,
        }));
    };

    /**
     * Delete
     */
    const deleteMutation = useCrudMutation({
        queryKey,
        api: removeApi,
    });

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id, {
            onSuccess: (res) => {
                showToast('success', 'Xóa thành công', res?.message ?? 'Xóa thành công');
            },

            onError: (error: any) => {
                showToast(
                    'error',
                    'Xóa thất bại',
                    error?.response?.data?.message ?? 'Đã có lỗi xảy ra'
                );
            },
        });
    };

    /**
     * Active
     */
    const activeMutation = useCrudMutation({
        queryKey,
        api: activeApi,
    });

    const handleActive = (id: string) => {
        activeMutation.mutate(id, {
            onSuccess: (res) => {
                showToast(
                    'success',
                    'Kích hoạt người dùng thành công',
                    res?.message ?? 'Kích hoạt thành công'
                );
            },

            onError: (error: any) => {
                showToast(
                    'error',
                    'Kích hoạt người dùng thất bại',
                    error?.response?.data?.message ?? 'Đã có lỗi xảy ra'
                );
            },
        });
    };

    /**
     * Inactive
     */
    const inactiveMutation = useCrudMutation({
        queryKey,
        api: inactiveApi,
    });

    const handleInactive = (id: string) => {
        inactiveMutation.mutate(id, {
            onSuccess: (res) => {
                showToast(
                    'success',
                    'Vô hiệu hóa người dùng thành công',
                    res?.message ?? 'Ngưng hoạt động thành công'
                );
            },

            onError: (error: any) => {
                showToast(
                    'error',
                    'Vô hiệu hóa người dùng thất bại',
                    error?.response?.data?.message ?? 'Đã có lỗi xảy ra'
                );
            },
        });
    };

    return {
        data,

        pagination,

        params,

        filterValues,

        loading: isPending,

        fetching: isFetching,

        refetch,

        setParams,

        setFilterValues,

        handleParamsChange,

        handleFilterChange,

        handleFilterSubmit,

        handleFilterReset,

        handleChangePage,

        handleChangePageSize,

        handleDelete,

        handleActive,

        handleInactive,

        deleting: deleteMutation.isPending,

        activating: activeMutation.isPending,

        inactivating: inactiveMutation.isPending,
    };
};

export default useTable;
