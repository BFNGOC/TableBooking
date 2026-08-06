'use client';

import { FormModalModeType } from '@/shared/types/form-modal-mode-type';
import ModalFormTabs from '@/shared/components/modals/ModalFormTabs';
import { IArea } from '../types/area.type';
import { AREA_SECTIONS } from '../constants/area-form-sections';

interface AreaFormModalProps {
    isOpen: boolean;
    mode?: FormModalModeType;
    values: Partial<IArea> | null;
    onValuesChange: (values: Partial<IArea>) => void;
    onClose: () => void;
    onSubmit: (values: Partial<IArea>) => void;
    isPending?: boolean;
}

function AreaFormModal({
    isOpen,
    mode = 'create',
    values,
    onValuesChange,
    onClose,
    onSubmit,
    isPending,
}: AreaFormModalProps) {
    return (
        <ModalFormTabs<IArea>
            isOpen={isOpen}
            title={({ mode }) =>
                mode === 'edit' ? 'Chỉnh sửa khu vực' : 'Thêm khu vực mới'
            }
            mode={mode}
            values={values}
            onValuesChange={onValuesChange}
            sections={AREA_SECTIONS}
            onClose={onClose}
            onSubmit={onSubmit}
            isPending={isPending}
        />
    );
}

export default AreaFormModal;
