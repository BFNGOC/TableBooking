'use client';

import { Link } from '@heroui/react';

interface IFooterAuthProps {
    text?: string;
    href: string;
    linkText: string;
}

function FooterAuth({ text, href, linkText }: IFooterAuthProps) {
    return (
        <p className="text-center text-sm text-gray-500">
            {text}{' '}
            <Link href={href} className="font-semibold text-[#6f4e37]">
                {linkText}
            </Link>
        </p>
    );
}

export default FooterAuth;
