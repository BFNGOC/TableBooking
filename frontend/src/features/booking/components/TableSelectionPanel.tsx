'use client';

import CustomCard from '@/shared/components/card/CustomCard';

import { ITableDetail } from '../types/booking-response';

interface TableAreaGroup {
    area: {
        name: string;
        _id: string;
    };
    tables: ITableDetail[];
}

interface TableSelectionPanelProps {
    tableAreas: TableAreaGroup[];
    selectedTables: ITableDetail[];
    onToggleTable: (table: ITableDetail) => void;
}

const renderStatusLabel = (status: string) => {
    switch (status) {
        case 'AVAILABLE':
            return (
                <span className="rounded-full bg-[#d9ead3] px-2 py-1 text-[10px] font-semibold text-[#386641]">
                    Trống
                </span>
            );
        case 'RESERVED':
            return (
                <span className="rounded-full bg-[#ebdcd5] px-2 py-1 text-[10px] font-semibold text-[#7a4f36]">
                    Đã đặt
                </span>
            );
        default:
            return (
                <span className="rounded-full bg-[#f2e0d6] px-2 py-1 text-[10px] font-semibold text-[#7a4f36]">
                    Đang sử dụng
                </span>
            );
    }
};

function TableSelectionPanel({
    tableAreas,
    selectedTables,
    onToggleTable,
}: TableSelectionPanelProps) {
    return (
        <CustomCard className="space-y-4">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-[#1f2937]">Chọn vị trí yêu thích</h2>
                <p className="text-sm text-gray-500">
                    Chọn một hoặc nhiều bàn phù hợp với nhu cầu của bạn. Không cần sơ đồ mặt bằng.
                </p>
            </div>

            {tableAreas.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                    Không có bàn phù hợp trong thời gian này.
                </div>
            ) : (
                <div className="space-y-6">
                    {tableAreas.map((area) => (
                        <div
                            key={area.area._id}
                            className="rounded-3xl border border-[#e5ddd6] bg-white p-4"
                        >
                            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.2em] text-[#7a4f36]">
                                        Khu vực
                                    </p>
                                    <h3 className="text-lg font-semibold text-[#1f2937]">
                                        {area.area.name}
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-500">{area.tables.length} bàn</p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {area.tables.map((table) => {
                                    const isAvailable = table.status === 'AVAILABLE';
                                    const isSelected = selectedTables.some(
                                        (selectedTable) => selectedTable._id === table._id
                                    );

                                    return (
                                        <button
                                            key={table._id}
                                            type="button"
                                            onClick={() => onToggleTable(table)}
                                            disabled={!isAvailable}
                                            className={`group rounded-3xl border p-4 text-left transition duration-200 ${
                                                isSelected
                                                    ? 'border-[#6f4e37] bg-[#f8efe8]'
                                                    : 'border-[#6f4e37] bg-white hover:border-[#6f4e37] hover:bg-[#f5efeb]'
                                            } ${!isAvailable ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-base font-semibold text-[#1f2937]">
                                                        Bàn {table.tableNumber}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {table.capacity} người
                                                    </p>
                                                </div>
                                                {renderStatusLabel(table.status)}
                                            </div>

                                            {table.description && (
                                                <p className="mt-3 text-sm text-gray-500">
                                                    {table.description}
                                                </p>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </CustomCard>
    );
}

export default TableSelectionPanel;
