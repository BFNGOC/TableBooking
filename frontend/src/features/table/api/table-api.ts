import { clientRequest } from "@/shared/library/axios/client-api";
import { ITable } from "../types/table.type";
import {
	CreateTablePayload,
	FindTablesParams,
	UpdateTablePayload,
	UpdateTablePositionPayload,
} from "../types/table-payload";

const API_URL_PREFIX = "/tables";

export const tableApi = {
	getAll: async (queryParams: FindTablesParams) => {
		const res = await clientRequest<ITable[]>({
			url: `${API_URL_PREFIX}`,
			method: "GET",
			queryParams,
		});

		return res.data;
	},

	getOne: async (tableId: string) => {
		const res = await clientRequest<ITable>({
			url: `${API_URL_PREFIX}/${tableId}`,
			method: "GET",
		});

		return res.data;
	},

	create: async (payload: CreateTablePayload) => {
		const res = await clientRequest<ITable>({
			url: `${API_URL_PREFIX}`,
			method: "POST",
			body: payload,
		});

		return res.data;
	},

	update: async (tableId: string, payload: UpdateTablePayload) => {
		const res = await clientRequest<ITable>({
			url: `${API_URL_PREFIX}/${tableId}`,
			method: "PATCH",
			body: payload,
		});

		return res.data;
	},

	updatePosition: async (
		tableId: string,
		payload: UpdateTablePositionPayload,
	) => {
		const res = await clientRequest<ITable>({
			url: `${API_URL_PREFIX}/${tableId}/position`,
			method: "PATCH",
			body: payload,
		});

		return res.data;
	},

	remove: async (tableId: string) => {
		const res = await clientRequest<{ message: string }>({
			url: `${API_URL_PREFIX}/${tableId}`,
			method: "DELETE",
		});

		return res.data;
	},
};
