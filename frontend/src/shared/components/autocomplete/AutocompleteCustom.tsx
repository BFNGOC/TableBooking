'use client';

import type { Key } from '@heroui/react';
import {
    Autocomplete,
    EmptyState,
    Label,
    ListBox,
    SearchField,
    Tag,
    TagGroup,
    useFilter,
} from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';
import { FormField } from '@/shared/types/form-field';

function AutocompleteCustom({
    label,
    name,
    placeholder,
    isRequired,
    isDisabled,
    hidden,
    value,
    onChange,
    options = [],
    selectionMode = 'single',
    className,
}: FormField) {
    const { contains } = useFilter({ sensitivity: 'base' });
    const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);

    const items = useMemo(
        () => options.map((option) => ({ id: option.id, name: option.text })),
        [options]
    );

    useEffect(() => {
        if (Array.isArray(value)) {
            setSelectedKeys(value.map((item) => String(item)) as Key[]);
            return;
        }

        if (value == null || value === '') {
            setSelectedKeys([]);
            return;
        }

        setSelectedKeys([String(value)] as Key[]);
    }, [value]);

    const onRemoveTags = (keys: Set<Key>) => {
        const nextKeys = selectedKeys.filter((key) => !keys.has(key));
        setSelectedKeys(nextKeys);

        if (selectionMode === 'multiple') {
            onChange?.(nextKeys.map((key) => String(key)));
        }
    };

    const handleSelectionChange = (keys: Key | Key[] | null) => {
        const nextKeys = Array.isArray(keys) ? keys : keys ? [keys] : [];
        const values = nextKeys.map((key) => String(key));

        setSelectedKeys(nextKeys);
        onChange?.(selectionMode === 'multiple' ? values : (values[0] ?? ''));
    };

    if (hidden) return null;

    return (
        <div className={`w-full ${className ?? ''}`.trim()}>
            <Autocomplete
                name={name}
                className="w-full"
                placeholder={placeholder ?? 'Select option'}
                selectionMode={selectionMode}
                value={selectedKeys}
                isRequired={isRequired}
                isDisabled={isDisabled}
                onChange={handleSelectionChange}
            >
                {label ? (
                    <Label className="mb-2 text-sm font-medium text-gray-700">{label}</Label>
                ) : null}
                <Autocomplete.Trigger>
                    <Autocomplete.Value>
                        {({ defaultChildren, isPlaceholder, state }: any) => {
                            if (isPlaceholder || state.selectedItems.length === 0) {
                                return defaultChildren;
                            }

                            if (selectionMode === 'multiple') {
                                const selectedItemsKeys = state.selectedItems.map(
                                    (item: any) => item.key
                                );
                                return (
                                    <TagGroup size="sm" onRemove={onRemoveTags}>
                                        <TagGroup.List>
                                            {selectedItemsKeys.map((selectedItemKey: Key) => {
                                                const item = items.find(
                                                    (s) => s.id === selectedItemKey
                                                );
                                                if (!item) return null;
                                                return (
                                                    <Tag key={item.id} id={item.id}>
                                                        {item.name}
                                                    </Tag>
                                                );
                                            })}
                                        </TagGroup.List>
                                    </TagGroup>
                                );
                            }

                            return defaultChildren;
                        }}
                    </Autocomplete.Value>
                    <Autocomplete.Indicator />
                </Autocomplete.Trigger>
                <Autocomplete.Popover>
                    <Autocomplete.Filter filter={contains}>
                        <SearchField autoFocus name="search" variant="secondary">
                            <SearchField.Group>
                                <SearchField.SearchIcon />
                                <SearchField.Input placeholder="Search..." />
                                <SearchField.ClearButton />
                            </SearchField.Group>
                        </SearchField>
                        <ListBox renderEmptyState={() => <EmptyState>No results found</EmptyState>}>
                            {items.map((item) => (
                                <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
                                    {item.name}
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                            ))}
                        </ListBox>
                    </Autocomplete.Filter>
                </Autocomplete.Popover>
            </Autocomplete>
        </div>
    );
}

export default AutocompleteCustom;
