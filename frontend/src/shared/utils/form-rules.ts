import { passwordRegex } from '@/shared/utils/password-regex';

export const formRules = {
    email: (value: string) => {
        if (!value) return 'Email là bắt buộc';

        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            return 'Email không hợp lệ';
        }

        return null;
    },

    password: (value: string) => {
        if (!value) return 'Mật khẩu là bắt buộc';

        if (value.length < 6) {
            return 'Mật khẩu tối thiểu 6 ký tự';
        }

        if (!passwordRegex.test(value)) {
            return 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt';
        }

        return null;
    },

    phone: (value: string) => {
        if (!value) return 'Số điện thoại là bắt buộc';

        if (!/^[0-9]{9,11}$/.test(value)) {
            return 'Số điện thoại phải gồm 9 đến 11 chữ số';
        }

        return null;
    },

    required: (label: string) => (value: string) => {
        if (!value?.trim()) {
            return `${label} là bắt buộc`;
        }

        return null;
    },

    minLength: (min: number) => (value: string) => {
        if (value.length < min) {
            return `Tối thiểu ${min} ký tự`;
        }

        return null;
    },

    maxLength: (max: number) => (value: string) => {
        if (value.length > max) {
            return `Tối đa ${max} ký tự`;
        }

        return null;
    },
};
