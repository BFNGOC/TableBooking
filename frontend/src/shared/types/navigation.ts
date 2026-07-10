import { ReactNode } from 'react';

export interface NavItem {
    label: ReactNode;

    href?: string;

    icon?: ReactNode;

    exact?: boolean;

    children?: NavItem[];
}
