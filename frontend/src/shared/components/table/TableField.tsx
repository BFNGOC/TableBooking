function TableListField({ value }: { value?: any[] }) {
    if (!Array.isArray(value) || value.length === 0) {
        return <div>Không có bàn</div>;
    }

    return (
        <div className="space-y-3">
            {value.map((table) => (
                <div key={table._id} className="rounded-xl border p-4">
                    <div className="flex justify-between">
                        <span className="font-semibold">Bàn {table.tableNumber}</span>

                        <span>{table.status}</span>
                    </div>

                    <div className="text-sm text-gray-500">Sức chứa: {table.capacity} người</div>
                </div>
            ))}
        </div>
    );
}

export default TableListField;
