export const getDefaultDate = (): string =>
	new Date().toISOString().slice(0, 10);

export const getDefaultTime = (): string => {
	const now = new Date();
	const pad = (value: number) => String(value).padStart(2, "0");
	return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
};
