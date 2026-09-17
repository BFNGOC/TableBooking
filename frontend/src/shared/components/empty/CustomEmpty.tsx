import { EmptyState } from '@heroui/react';
import { Inbox } from 'lucide-react';

function CustomEmpty() {
    return (
        <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center py-10">
            <Inbox className="size-8 text-gray-400" />

            <span className="text-sm text-gray-500">Không có kết quả</span>
        </EmptyState>
    );
}

export default CustomEmpty;
