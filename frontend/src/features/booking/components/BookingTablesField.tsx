import { TABLE_STATUS_OPTIONS } from '@/features/table/constants/table-option';

interface BookingTablesFieldProps {
    label?: string;
    value?: any[];
}

function BookingTablesField({ label, value }: BookingTablesFieldProps) {
    const tables = Array.isArray(value) ? value : [];

    return (
        <div className="w-full">
            {label && <div className="mb-3 text-sm font-semibold text-gray-700">{label}</div>}

            {tables.length === 0 ? (
                <div className="rounded-lg border p-4 text-sm text-gray-500">
                    Không có bàn được đặt
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {tables.map((table) => (
                        <div key={table._id} className="rounded-xl border bg-gray-50 p-4">
                            <div className="flex justify-between">
                                <span className="font-semibold">Bàn {table.tableNumber}</span>

                                <span>
                                    {
                                        TABLE_STATUS_OPTIONS.find(
                                            (item) => item.id === table.status
                                        )?.text
                                    }
                                </span>
                            </div>

                            <div className="mt-2 text-sm text-gray-600">
                                Sức chứa: {table.capacity} người
                            </div>

                            {table.areaId && (
                                <div className="text-sm text-gray-600">
                                    Khu vực: {table.areaId.name}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BookingTablesField;
