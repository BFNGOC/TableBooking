"use client";

import { useEffect, useState } from "react";
import { Button, Spinner } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";

import { useGetRestaurantBySlug } from "@/features/restaurant/hooks/useGetRestaurant";
import CustomForm from "@/shared/components/form/CustomForm";
import { formatFormValues } from "@/shared/utils/format-form-values";

import BookingSummaryBar from "../../components/BookingSummaryBar";
import RestaurantHeaderCard from "../../components/RestaurantHeaderCard";
import TableSelectionPanel from "../../components/TableSelectionPanel";
import { availableTableFormField } from "../../constants/availabe-table-form-field";
import { useGetAvailableTables } from "../../hook/useAvailableTables";
import { GetAvailableTablesPayload } from "../../types/booking.dto";
import { ITableDetail } from "../../types/booking-response";

interface DiscoverTablePageProps {
	slug: string;
}

function DiscoverTablePage({ slug }: DiscoverTablePageProps) {
	const { data: restaurant, isPending } = useGetRestaurantBySlug(slug);
	const router = useRouter();
	const urlSearchParams = useSearchParams();

	const bookingDateFromUrl = urlSearchParams.get("bookingDate") ?? "";
	const startTimeFromUrl = urlSearchParams.get("startTime") ?? "";
	const guestCountFromUrl = Number(urlSearchParams.get("guestCount") ?? 1);
	const initialFilterValues = formatFormValues(
		{
			date: bookingDateFromUrl,
			startTime: startTimeFromUrl,
			guestCount: guestCountFromUrl,
		},
		availableTableFormField,
		"toForm",
	) as GetAvailableTablesPayload;

	const [filterValues, setFilterValues] =
		useState<GetAvailableTablesPayload>(initialFilterValues);
	const [searchParams, setSearchParams] =
		useState<GetAvailableTablesPayload>();
	const [selectedTables, setSelectedTables] = useState<ITableDetail[]>([]);

	const {
		data: availableTablesResponse,
		isFetching: isFetchingAvailableTables,
		isFetched: hasFetchedAvailableTables,
	} = useGetAvailableTables(restaurant?._id ?? "", searchParams);

	const availableTables = availableTablesResponse?.data;
	const tableAreas = availableTables?.areas ?? [];

	useEffect(() => {
		if (!restaurant?._id) return;
		if (!bookingDateFromUrl || !startTimeFromUrl || guestCountFromUrl < 1) {
			return;
		}

		const parsedValues = formatFormValues(
			{
				date: bookingDateFromUrl,
				startTime: startTimeFromUrl,
				guestCount: guestCountFromUrl,
			},
			availableTableFormField,
			"toForm",
		) as GetAvailableTablesPayload;

		setSearchParams(parsedValues);
	}, [
		restaurant?._id,
		bookingDateFromUrl,
		startTimeFromUrl,
		guestCountFromUrl,
	]);

	const formatDateValue = (dateValue: unknown) => {
		if (
			dateValue &&
			typeof dateValue === "object" &&
			"year" in dateValue &&
			"month" in dateValue &&
			"day" in dateValue
		) {
			return `${dateValue.year}-${String(dateValue.month).padStart(2, "0")}-${String(
				dateValue.day,
			).padStart(2, "0")}`;
		}

		return String(dateValue);
	};

	const handleSearchTables = () => {
		const payload = formatFormValues(
			filterValues,
			availableTableFormField,
			"toApi",
		);
		const params: GetAvailableTablesPayload = {
			date: formatDateValue(payload.date),
			startTime: payload.startTime as string,
			guestCount: Number(payload.guestCount),
		};

		setSelectedTables([]);
		setSearchParams(params);
	};

	const handleTableToggle = (table: ITableDetail) => {
		const isAvailable = table.status === "AVAILABLE";

		if (!isAvailable) {
			return;
		}

		setSelectedTables((prev) =>
			prev.some((selectedTable) => selectedTable._id === table._id)
				? prev.filter(
						(selectedTable) => selectedTable._id !== table._id,
					)
				: [...prev, table],
		);
	};

	const getSelectedAreaNames = () =>
		Array.from(
			new Set(
				selectedTables
					.map(
						(table) =>
							tableAreas.find(
								(area: {
									area: { name: string; _id: string };
									tables: ITableDetail[];
								}) =>
									area.tables.some(
										(item: ITableDetail) =>
											item._id === table._id,
									),
							)?.area.name,
					)
					.filter((name): name is string => Boolean(name)),
			),
		);

	const getSelectedCapacity = () =>
		selectedTables.reduce((total, table) => total + table.capacity, 0);

	const handleClickNext = () => {
		router.push(
			`/restaurants/${slug}/booking?tables=${selectedTables
				.map((table) => table._id)
				.join(
					",",
				)}&bookingDate=${searchParams?.date}&startTime=${searchParams?.startTime}&guestCount=${searchParams?.guestCount}`,
		);
	};

	if (isPending) {
		return (
			<div className="flex h-full items-center justify-center">
				<Spinner />
			</div>
		);
	}

	if (!restaurant) {
		return (
			<div className="flex h-full items-center justify-center">
				Không tìm thấy nhà hàng
			</div>
		);
	}

	return (
		<div className="relative flex flex-col gap-4">
			<RestaurantHeaderCard restaurant={restaurant} />

			<div className="rounded-[24px] border border-[#e5ddd6] bg-white p-4 shadow-sm sm:p-6">
				<CustomForm<GetAvailableTablesPayload>
					fields={availableTableFormField}
					values={filterValues}
					onValuesChange={(values) =>
						setFilterValues((prev) => ({
							...prev,
							...values,
						}))
					}
					onSubmit={handleSearchTables}
					footer={
						<Button
							type="submit"
							className="bg-[#6f4e37]"
							size="lg"
							isPending={isFetchingAvailableTables}
						>
							Tìm bàn ngay
						</Button>
					}
					footerClassName="col-span-3 items-center justify-center"
				/>
			</div>

			{(isFetchingAvailableTables || hasFetchedAvailableTables) && (
				<TableSelectionPanel
					tableAreas={
						tableAreas as Array<{
							area: { name: string; _id: string };
							tables: ITableDetail[];
						}>
					}
					selectedTables={selectedTables}
					onToggleTable={handleTableToggle}
				/>
			)}

			<BookingSummaryBar
				selectedTables={selectedTables}
				selectedAreaNames={getSelectedAreaNames()}
				selectedCapacity={getSelectedCapacity()}
				bookingDate={availableTables?.date}
				startTime={availableTables?.startTime}
				onContinue={handleClickNext}
			/>
		</div>
	);
}

export default DiscoverTablePage;
