import { IUser } from "../types/user-type";
import { UserFilterParams } from "../types/user-filter-params-type";
import { UserFindAllPaginationType } from "../types/user-find-all-pagination-type";
import { CreateUserPayload, UpdateUserPayload } from "../types/user-payload";
import { clientRequest } from "@/shared/library/axios/client-api";

const API_URL_PREFIX = "/users";

export const userRoleUserApi = {
	getMe: async () => {
		const res = await clientRequest<IUser>({
			url: `${API_URL_PREFIX}/me`,
			method: "GET",
		});

		return res.data;
	},

	update: async (payload: UpdateUserPayload) => {
		const res = await clientRequest<IUser>({
			url: `${API_URL_PREFIX}/me`,
			method: "PATCH",
			body: payload,
		});

		return res.data;
	},
};

export const userRoleAdminApi = {
	getAll: async (queryParams?: UserFilterParams) => {
		const res = await clientRequest<UserFindAllPaginationType>({
			url: `${API_URL_PREFIX}`,
			method: "GET",
			queryParams,
		});

		return res.data;
	},
	create: async (payload: CreateUserPayload) => {
		const res = await clientRequest<IUser>({
			url: `${API_URL_PREFIX}`,
			method: "POST",
			body: payload,
		});

		return res.data;
	},

	update: async (_id: string, payload: UpdateUserPayload) => {
		const res = await clientRequest<IUser>({
			url: `${API_URL_PREFIX}/${_id}`,
			method: "PATCH",
			body: payload,
		});

		return res.data;
	},

	delete: async (_id: string) => {
		const res = await clientRequest<IUser>({
			url: `${API_URL_PREFIX}/${_id}`,
			method: "DELETE",
		});

		return res.data;
	},

	active: async (_id: string) => {
		const res = await clientRequest<IUser>({
			url: `${API_URL_PREFIX}/${_id}/active`,
			method: "POST",
		});

		return res.data;
	},

	inactive: async (_id: string) => {
		const res = await clientRequest<IUser>({
			url: `${API_URL_PREFIX}/${_id}/inactive`,
			method: "POST",
		});

		return res.data;
	},
};
