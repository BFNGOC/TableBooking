export interface FormField {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    isRequired?: boolean;
    validate?: (value: string) => string | null;
}
