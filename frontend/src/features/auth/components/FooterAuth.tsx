'use client';

import { Link } from '@heroui/react';

interface IFooterAuthProps {
    text?: string;
    href?: string;
    linkText: string;
    onClick?: any;
}

function FooterAuth({ text, href, linkText, onClick }: IFooterAuthProps) {
    return (
        <p className="text-center text-sm text-gray-500">
            {text}{' '}
            <Link href={href} className="font-semibold text-[#6f4e37]" onClick={onClick}>
                {linkText}
            </Link>
        </p>
    );
}

export default FooterAuth;
