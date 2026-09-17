import { Tooltip } from '@heroui/react';
import React from 'react';

interface TooltipProps {
    children: React.ReactNode;
    tooltip: string;
    delay?: number;
}

function TooltipCustom({ children, tooltip, delay = 0 }: TooltipProps) {
    return (
        <Tooltip delay={delay}>
            {children}
            <Tooltip.Content>
                <p>{tooltip}</p>
            </Tooltip.Content>
        </Tooltip>
    );
}

export default TooltipCustom;
