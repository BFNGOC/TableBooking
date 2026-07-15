import { Card } from '@heroui/react';

interface ICustomCardProps {
    className?: string;
    headerTitle?: string;
    subtitle?: string;
    children?: React.ReactNode;
    footerContent?: React.ReactNode;
}

function CustomCard({
    className,
    headerTitle,
    subtitle,
    children,
    footerContent,
}: ICustomCardProps) {
    return (
        <Card className={`w-full  border shadow-md ${className ? className : ''}`}>
            {headerTitle && (
                <Card.Header>
                    <Card.Title>{headerTitle}</Card.Title>
                    {subtitle && <Card.Description>{subtitle}</Card.Description>}
                </Card.Header>
            )}
            <Card.Content>{children}</Card.Content>
            {footerContent && <Card.Footer>{footerContent}</Card.Footer>}
        </Card>
    );
}

export default CustomCard;
