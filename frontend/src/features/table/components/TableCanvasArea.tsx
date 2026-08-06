'use client';

import { useRef, useCallback } from 'react';
import { Stage, Layer, Group, Circle, Text } from 'react-konva';
import { ITable, TableStatus } from '../types/table.type';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 560;
const TABLE_RADIUS = 40;

function getTableFill(status?: TableStatus, isSelected?: boolean): string {
    if (isSelected) return '#6f4e37';
    switch (status) {
        case TableStatus.AVAILABLE:
            return '#bbf7d0';
        case TableStatus.MAINTENANCE:
            return '#fecaca';
        case TableStatus.DISABLED:
            return '#e5e7eb';
        default:
            return '#bbf7d0';
    }
}

function getTableStroke(status?: TableStatus, isSelected?: boolean): string {
    if (isSelected) return '#4a3424';
    switch (status) {
        case TableStatus.AVAILABLE:
            return '#16a34a';
        case TableStatus.MAINTENANCE:
            return '#dc2626';
        case TableStatus.DISABLED:
            return '#9ca3af';
        default:
            return '#16a34a';
    }
}

function getTableTextColor(isSelected?: boolean): string {
    return isSelected ? '#ffffff' : '#374151';
}

interface TableNodeProps {
    table: ITable;
    isSelected: boolean;
    editMode: boolean;
    onSelect: (table: ITable) => void;
    onDragEnd: (tableId: string, x: number, y: number) => void;
}

function TableNode({ table, isSelected, editMode, onSelect, onDragEnd }: TableNodeProps) {
    const x = table.x ?? 80;
    const y = table.y ?? 80;

    return (
        <Group
            x={x}
            y={y}
            draggable={editMode}
            onClick={() => onSelect(table)}
            onTap={() => onSelect(table)}
            onDragEnd={(e) => {
                onDragEnd(table._id!, e.target.x(), e.target.y());
            }}
        >
            {/* Shadow circle */}
            <Circle
                radius={TABLE_RADIUS + 2}
                fill="rgba(0,0,0,0.06)"
                offsetY={-2}
            />
            {/* Main circle */}
            <Circle
                radius={TABLE_RADIUS}
                fill={getTableFill(table.status, isSelected)}
                stroke={getTableStroke(table.status, isSelected)}
                strokeWidth={isSelected ? 2.5 : 1.5}
            />
            {/* Table number */}
            <Text
                text={table.tableNumber ?? '?'}
                fontSize={16}
                fontStyle="bold"
                fill={getTableTextColor(isSelected)}
                align="center"
                verticalAlign="middle"
                width={TABLE_RADIUS * 2}
                height={TABLE_RADIUS * 2}
                offsetX={TABLE_RADIUS}
                offsetY={TABLE_RADIUS}
            />
            {/* Capacity badge */}
            <Circle
                x={TABLE_RADIUS - 6}
                y={-(TABLE_RADIUS - 6)}
                radius={13}
                fill={isSelected ? '#4a3424' : '#374151'}
            />
            <Text
                x={TABLE_RADIUS - 6 - 13}
                y={-(TABLE_RADIUS - 6) - 13}
                text={String(table.capacity ?? '')}
                fontSize={11}
                fontStyle="bold"
                fill="#ffffff"
                align="center"
                verticalAlign="middle"
                width={26}
                height={26}
            />
            {/* Edit cursor hint */}
            {editMode && (
                <Circle
                    radius={TABLE_RADIUS}
                    fill="transparent"
                    strokeWidth={0}
                />
            )}
        </Group>
    );
}

interface TableCanvasAreaProps {
    tables: ITable[];
    selectedTableId?: string;
    editMode: boolean;
    onSelectTable: (table: ITable) => void;
    onPositionChange: (tableId: string, x: number, y: number) => void;
}

function TableCanvasArea({
    tables,
    selectedTableId,
    editMode,
    onSelectTable,
    onPositionChange,
}: TableCanvasAreaProps) {
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleDragEnd = useCallback(
        (tableId: string, x: number, y: number) => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                onPositionChange(tableId, x, y);
            }, 600);
        },
        [onPositionChange],
    );

    return (
        <div className="overflow-auto rounded-2xl border border-slate-200 bg-[#fafaf8]">
            <Stage
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                style={{ cursor: editMode ? 'grab' : 'default' }}
            >
                <Layer>
                    {tables.map((table) => (
                        <TableNode
                            key={table._id}
                            table={table}
                            isSelected={table._id === selectedTableId}
                            editMode={editMode}
                            onSelect={onSelectTable}
                            onDragEnd={handleDragEnd}
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
}

export default TableCanvasArea;
