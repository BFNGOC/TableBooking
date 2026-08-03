export const formatPriceRange = (
	priceFrom: number = 0,
	priceTo: number = 0,
): string => {
	const from = priceFrom || 0;
	const to = priceTo || 0;

	const formatVND = (price: number) => {
		if (price === 0) return "500đ";
		return `${price.toLocaleString("vi-VN")}đ`;
	};

	if (from === 0 && to === 0) return "500đ+";
	if (from === 0) return `Đến ${formatVND(to)}`;
	if (to === 0) return `Từ ${formatVND(from)}`;

	return `${formatVND(from)} - ${formatVND(to)}`;
};
