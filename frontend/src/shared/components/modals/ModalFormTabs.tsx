'use client';

import { useState } from 'react';
import { Button, Tabs } from '@heroui/react';

import ModalCustom from './ModalCustom';
import CustomForm from '../form/CustomForm';

import { FormModalModeType } from '@/shared/types/form-modal-mode-type';
import { FormField } from '@/shared/types/form-field';

export interface FormSection<T = any> {
    key: string;
    title: string;
    fields: FormField[];

    hidden?: boolean | ((context: { dataForm: Partial<T> }) => boolean);

    disabled?: boolean;
}

interface ModalFormTabsProps<T extends Record<string, any>> {
    isOpen: boolean;

    title: string;

    mode?: FormModalModeType;

    values: Partial<T> | null;

    onValuesChange: (values: Partial<T>) => void;

    sections: FormSection[];

    onClose: () => void;

    onSubmit: (values: Partial<T>) => void;

    isPending?: boolean;
}

function ModalFormTabs<T extends Record<string, any>>({
    isOpen,
    title,
    mode = 'create',
    values,
    onValuesChange,
    sections,
    onClose,
    onSubmit,
    isPending = false,
}: ModalFormTabsProps<T>) {
    const [uploadLoading, setUploadLoading] = useState(false);

    const visibleSections = sections.filter((section) => {
        if (typeof section.hidden === 'function') {
            return !section.hidden({
                dataForm: values ?? {},
            });
        }

        return !section.hidden;
    });

    return (
        <ModalCustom
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
            title={title}
            size="lg"
        >
            <Tabs variant="secondary" className="my-3">
                <Tabs.ListContainer>
                    <Tabs.List aria-label="Thông tin">
                        {visibleSections.map((section) => (
                            <Tabs.Tab key={section.key} id={section.key}>
                                {section.title}
                                <Tabs.Indicator />
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                </Tabs.ListContainer>

                {visibleSections.map((section) => (
                    <Tabs.Panel key={section.key} id={section.key}>
                        <CustomForm
                            fields={section.fields}
                            values={values}
                            onValuesChange={onValuesChange}
                            onSubmit={onSubmit}
                            mode={mode}
                            onUploadLoadingChange={setUploadLoading}
                            footer={
                                mode !== 'view' && (
                                    <>
                                        <Button type="button" variant="outline" onPress={onClose}>
                                            Hủy
                                        </Button>

                                        <Button
                                            type="submit"
                                            variant="danger-soft"
                                            isPending={isPending || uploadLoading}
                                            isDisabled={isPending || uploadLoading}
                                        >
                                            Lưu
                                        </Button>
                                    </>
                                )
                            }
                            footerClassName="justify-end"
                        />
                    </Tabs.Panel>
                ))}
            </Tabs>
        </ModalCustom>
    );
}

export default ModalFormTabs;
