export interface NavItem {
    label?: string | React.ReactNode | null;
    href: string;
    icon?: React.ReactNode;
    exact?: boolean;
}
