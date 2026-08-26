import { TableStatus, DepositType } from "./table.type";

export type CreateTablePayload = {
	areaId: string;
	capacity: number;
	tableNumber?: string;
	x?: number;
	y?: number;
	status?: TableStatus;
	description?: string;
	basePrice?: number;
	depositAmount?: number;
	depositType?: DepositType;
};

export type UpdateTablePayload = Partial<CreateTablePayload> & {
	tableNumber?: string;
};

export type UpdateTablePositionPayload = {
	x: number;
	y: number;
};

export type BulkUpdatePositionsPayload = {
	positions: Array<{ tableId: string; x: number; y: number }>;
};

export type FindTablesParams = {
	areaId: string;
};
