import { Button } from '@heroui/react';
import CustomCard from '../card/CustomCard';
import { RotateCcw } from 'lucide-react';
import CustomForm from '../form/CustomForm';
import { FormField } from '@/shared/types/form-field';
import { ReactNode } from 'react';
import { FormModalModeType } from '@/shared/types/form-modal-mode-type';

export interface TableFilterCustomProps<T extends Record<string, any>> {
    fields: FormField[];

    values: Partial<T>;

    onValuesChange: (values: Partial<T>) => void;

    onSubmit?: (values: Partial<T>) => void;

    footer?: ReactNode;

    mode?: FormModalModeType;

    onReset?: () => void;
}

function TableFilterCustom<T extends Record<string, any>>({
    fields,
    values,
    onValuesChange,
    onSubmit,
    footer,
    mode = 'create',
    onReset,
}: TableFilterCustomProps<T>) {
    return (
        <CustomCard>
            <div className="flex justify-end mb-4">
                <Button type="button" size="sm" variant="danger-soft" onPress={n}>
                    <RotateCcw size={18} />
                </Button>
            </div>

            <CustomForm
                fields={fields}
                values={values}
                onValuesChange={onValuesChange}
                onSubmit={onSubmit}
                footer={footer}
                mode={mode}
            />
        </CustomCard>
    );
}

export default TableFilterCustom;
