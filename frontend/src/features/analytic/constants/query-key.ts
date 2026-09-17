export const analyticQueryKeys = {
    all: ['analytic'] as const,
    statistics: (query: unknown) => ['analytic', 'statistics', query] as const,
};
