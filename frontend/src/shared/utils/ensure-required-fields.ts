export function ensureRequiredFields<T extends Record<string, unknown>, K extends keyof T>(
    values: Partial<T>,
    requiredFields: readonly K[]
): T {
    const missingFields = requiredFields.filter((field) => {
        const value = values[field];

        return value == null || value === '' || (Array.isArray(value) && value.length === 0);
    });

    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return values as T;
}
