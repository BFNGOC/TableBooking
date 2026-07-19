'use client';

import { useState } from 'react';
import { Button, Form, Spinner, Tabs } from '@heroui/react';

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

    title: string | ((params: { mode: FormModalModeType; values: Partial<T> | null }) => string);

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

    const [selectedTab, setSelectedTab] = useState(visibleSections[0]?.key ?? '');

    const modalTitle = typeof title === 'function' ? title({ mode, values }) : title;

    return (
        <ModalCustom
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
            title={modalTitle}
            size="lg"
        >
            {isPending ? (
                <div className="flex h-60 items-center justify-center">
                    <Spinner />
                </div>
            ) : (
                <Form
                    onInvalid={(e) => {
                        e.preventDefault();

                        const target = e.target as HTMLInputElement;

                        const section = visibleSections.find((section) =>
                            section.fields.some((field) => field.name === target.name)
                        );

                        if (!section) return;

                        if (section.key !== selectedTab) {
                            setSelectedTab(section.key);

                            requestAnimationFrame(() => {
                                target.focus();
                                target.reportValidity();
                            });
                        }
                    }}
                    onSubmit={(e) => {
                        console.log('submit');
                        e.preventDefault();

                        const form = e.currentTarget;

                        if (!form.checkValidity()) {
                            form.reportValidity();
                            console.log('Form is invalid');
                            return;
                        }

                        onSubmit(values ?? {});
                    }}
                    className=""
                >
                    <Tabs
                        variant="secondary"
                        className="my-3"
                        selectedKey={selectedTab}
                        onSelectionChange={(key) => setSelectedTab(String(key))}
                    >
                        <Tabs.ListContainer className="w-full flex flex-row flex-nowrap gap-6 justify-start overflow-x-auto">
                            <Tabs.List aria-label="Thông tin">
                                {visibleSections.map((section) => (
                                    <Tabs.Tab
                                        key={section.key}
                                        id={section.key}
                                        className="whitespace-nowrap min-w-max px-2 h-12 text-sm font-medium data-[selected=true]:text-primary"
                                    >
                                        {section.title}
                                        <Tabs.Indicator />
                                    </Tabs.Tab>
                                ))}
                            </Tabs.List>
                        </Tabs.ListContainer>

                        <div className="mt-4">
                            {visibleSections.map((section) => (
                                <div
                                    key={section.key}
                                    className={selectedTab === section.key ? 'block' : 'hidden'}
                                >
                                    <CustomForm
                                        fields={section.fields}
                                        values={values}
                                        onValuesChange={onValuesChange}
                                        mode={mode}
                                        onUploadLoadingChange={setUploadLoading}
                                        renderForm={false}
                                    />
                                </div>
                            ))}
                        </div>
                    </Tabs>

                    {mode !== 'view' && (
                        <div className="mt-6 flex justify-end gap-3">
                            <Button variant="outline" onPress={onClose}>
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
                        </div>
                    )}
                </Form>
            )}
        </ModalCustom>
    );
}

export default ModalFormTabs;
