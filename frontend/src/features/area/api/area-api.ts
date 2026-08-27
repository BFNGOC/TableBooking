import { clientRequest } from "@/shared/library/axios/client-api";
import { IArea } from "../types/area.type";
import {
	CreateAreaPayload,
	FindAreasParams,
	UpdateAreaPayload,
} from "../types/area-payload";

const API_URL_PREFIX = "/areas";

export const areaApi = {
	getAll: async (queryParams: FindAreasParams) => {
		const res = await clientRequest<IArea[]>({
			url: `${API_URL_PREFIX}`,
			method: "GET",
			queryParams,
		});

		return res.data;
	},

	getOne: async (areaId: string) => {
		const res = await clientRequest<IArea>({
			url: `${API_URL_PREFIX}/${areaId}`,
			method: "GET",
		});

		return res.data;
	},

	create: async (payload: CreateAreaPayload) => {
		const res = await clientRequest<IArea>({
			url: `${API_URL_PREFIX}`,
			method: "POST",
			body: payload,
		});

		return res.data;
	},

	update: async (areaId: string, payload: UpdateAreaPayload) => {
		const res = await clientRequest<IArea>({
			url: `${API_URL_PREFIX}/${areaId}`,
			method: "PATCH",
			body: payload,
		});

		return res.data;
	},

	remove: async (areaId: string) => {
		const res = await clientRequest<{ message: string }>({
			url: `${API_URL_PREFIX}/${areaId}`,
			method: "DELETE",
		});

		return res.data;
	},
};
