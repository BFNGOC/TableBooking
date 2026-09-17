export const tableQueryKeys = {
	ALL: ["tables"] as const,
	GET_TABLES: (areaId: string) => ["tables", areaId] as const,
	GET_TABLE: (tableId: string) => ["tables", "detail", tableId] as const,
};
