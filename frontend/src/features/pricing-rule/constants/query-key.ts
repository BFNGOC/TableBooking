export const pricingRuleQueryKeys = {
    ALL: ['pricing-rules'] as const,
    LIST: (params: object) => ['pricing-rules', 'list', params] as const,
    DETAIL: (id: string) => ['pricing-rules', 'detail', id] as const,
};
