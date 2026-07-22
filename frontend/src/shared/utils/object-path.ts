export function getNestedValue(object: any, path: string) {
    return path.split('.').reduce((acc, key) => acc?.[key], object);
}

export function setNestedValue(object: any, path: string, value: any) {
    const result = structuredClone(object ?? {});

    const keys = path.split('.');

    let current = result;

    keys.forEach((key, index) => {
        if (index === keys.length - 1) {
            current[key] = value;
            return;
        }

        if (!current[key]) {
            current[key] = {};
        }

        current = current[key];
    });

    return result;
}
