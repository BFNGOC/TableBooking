import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';

interface UseCrudMutationProps<TPayload = string> {
    queryKey: QueryKey;

    api?: (payload: TPayload) => Promise<any>;
}

export function useCrudMutation<TPayload = string>({
    queryKey,
    api,
}: UseCrudMutationProps<TPayload>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: TPayload) => {
            if (!api) {
                throw new Error('Mutation api is not provided');
            }

            return api(payload);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey,
            });
        },
    });
}
