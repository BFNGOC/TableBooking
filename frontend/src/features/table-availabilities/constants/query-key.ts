export const tableAvailabilityQueryKeys = {
    ALL: ['table-availabilities'] as const,
    MY: ['table-availabilities', 'my'] as const,
    DETAIL: (id: string) => ['table-availabilities', 'detail', id] as const,
};
