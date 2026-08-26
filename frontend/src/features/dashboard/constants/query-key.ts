export const dashboardQueryKeys = {
    all: ['dashboard'] as const,
    detail: (period: string) => ['dashboard', period] as const,
};
