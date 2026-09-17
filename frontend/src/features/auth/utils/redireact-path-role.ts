export const getRedirectPathByRole = (role?: string) => {
    switch (role?.toUpperCase()) {
        case 'ADMIN':
            return '/admin/dashboard';
        case 'RESTAURANT':
            return '/restaurant/dashboard';
        case 'CUSTOMER':
        default:
            return '/';
    }
};
