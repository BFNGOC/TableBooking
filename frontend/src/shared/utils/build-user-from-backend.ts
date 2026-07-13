import { IUser } from "@/features/users/types/user-type";

export const buildUserFromBackend = (user: any): IUser => ({
	_id: user?._id?.toString?.() ?? user?.id?.toString?.() ?? "",
	name: user?.name ?? "",
	email: user?.email ?? "",
	role: user?.role ?? "CUSTOMER",
	accountType: user?.accountType ?? "LOCAL",
	isActive: user?.isActive ?? true,
	avatar: user?.avatar ?? null,
	phone: user?.phone ?? undefined,
	address: user?.address ?? undefined,
});
