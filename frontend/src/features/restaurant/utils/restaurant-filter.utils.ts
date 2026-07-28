import { FormField } from "@/shared/types/form-field";
import { formatFormValues } from "@/shared/utils/format-form-values";
import { RestaurantFilterRoleCustomerParams } from "../types/restaurant-filter-params-type";
import { PRICE_RANGE_OPTIONS } from "../constants/restaurant-options";

export function getPriceRange(priceRangeId: string): {
	minPrice?: number;
	maxPrice?: number;
} {
	const option = PRICE_RANGE_OPTIONS.find((o) => o.id === priceRangeId);
	if (!option) return {};

	const result: { minPrice?: number; maxPrice?: number } = {};
	if (option.minPrice !== undefined) result.minPrice = option.minPrice;
	if (option.maxPrice !== undefined) result.maxPrice = option.maxPrice;
	return result;
}

export function expandRestaurantFilterParams(
	formValues: Record<string, any>,
): Record<string, any> {
	const result = { ...formValues };

	if (result.priceRange) {
		const { minPrice, maxPrice } = getPriceRange(String(result.priceRange));
		if (minPrice !== undefined) result.minPrice = minPrice;
		if (maxPrice !== undefined) result.maxPrice = maxPrice;
	}
	delete result.priceRange;

	delete result.guests;

	return result;
}

export function buildRestaurantCustomerParams(
	formValues: Record<string, any>,
	fields: FormField[],
): Partial<RestaurantFilterRoleCustomerParams> {
	const formatted = formatFormValues(formValues, fields, "toApi");

	const expanded = expandRestaurantFilterParams(
		formatted as Record<string, any>,
	);

	const params: Partial<RestaurantFilterRoleCustomerParams> = {};

	if (expanded.keySearch && String(expanded.keySearch).trim() !== "") {
		params.keySearch = String(expanded.keySearch).trim();
	}
	if (expanded.cuisineTypes) {
		if (
			Array.isArray(expanded.cuisineTypes) &&
			expanded.cuisineTypes.length > 0
		) {
			params.cuisineTypes = expanded.cuisineTypes
				.map((c: any) => String(c).trim())
				.filter(Boolean);
		} else if (String(expanded.cuisineTypes).trim() !== "") {
			params.cuisineTypes = [String(expanded.cuisineTypes).trim()];
		}
	}
	if (expanded.minRating != null && expanded.minRating !== "") {
		const parsed = parseFloat(String(expanded.minRating));
		if (!isNaN(parsed)) params.minRating = parsed;
	}
	if (expanded.minPrice !== undefined) params.minPrice = expanded.minPrice;
	if (expanded.maxPrice !== undefined) params.maxPrice = expanded.maxPrice;
	if (
		expanded.sort &&
		String(expanded.sort).trim() !== "" &&
		expanded.sort !== "default"
	) {
		params.sort = String(expanded.sort).trim();
	}

	return params;
}
