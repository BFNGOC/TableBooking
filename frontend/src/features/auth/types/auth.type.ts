import { IUser } from "@/features/users/types/user-type";

export interface ILoginResponse {
	user: IUser;
	access_token: string;
	refresh_token: string;
}

export interface IRegisterResponse {
	user: IUser;
}

export type LoginPayload = {
	email: string;
	password: string;
};

export type LoginGooglePayload = {
	email: string;
	name: string;
	avatar?: string;
	providerId?: string;
};

export type RegisterPayload = {
	name: string;
	email: string;
	password: string;
};

export type VerifyPayload = {
	_id: string;
	code: string;
};

export type RetryActivePayload = {
	email: string;
};

export type ChangePasswordPayload = {
	email: string;
	code: string;
	password: string;
	confirmPassword: string;
};
