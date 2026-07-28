export function initialFormValuesFromUrl(
	searchParams: URLSearchParams,
): Record<string, any> {
	return {
		keySearch: searchParams.get("keySearch") ?? "",
		priceRange: searchParams.get("priceRange") ?? "",
		cuisineTypes: searchParams.get("cuisineTypes")
			? String(searchParams.get("cuisineTypes"))
					.split(",")
					.filter(Boolean)
			: undefined,
		minRating: searchParams.get("minRating") ?? undefined,
		sort: searchParams.get("sort") ?? "default",
	};
}

export function buildSearchUrl(formValues: Record<string, any>): string {
	const sp = new URLSearchParams();

	const str = (v: any) => (v != null ? String(v).trim() : "");

	if (str(formValues.keySearch))
		sp.set("keySearch", str(formValues.keySearch));
	if (str(formValues.priceRange))
		sp.set("priceRange", str(formValues.priceRange));
	if (
		formValues.cuisineTypes &&
		Array.isArray(formValues.cuisineTypes) &&
		formValues.cuisineTypes.length > 0
	) {
		sp.set("cuisineTypes", formValues.cuisineTypes.join(","));
	} else if (str(formValues.cuisineTypes)) {
		sp.set("cuisineTypes", str(formValues.cuisineTypes));
	}
	if (str(formValues.minRating))
		sp.set("minRating", str(formValues.minRating));
	if (str(formValues.sort) && formValues.sort !== "default")
		sp.set("sort", str(formValues.sort));

	const qs = sp.toString();
	return qs ? `/restaurants/search?${qs}` : "/restaurants/search";
}
