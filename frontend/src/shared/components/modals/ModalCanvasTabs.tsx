"use client";

import { useEffect, useState } from "react";
import { Button, Tabs } from "@heroui/react";
import { Stage, Layer, Rect, Text, Group } from "react-konva";
import ModalCustom from "./ModalCustom";

export interface CanvasTable {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	label: string;
	status: "empty" | "occupied" | "reserved";
}

export interface CanvasAreaSection {
	key: string;
	title: string;
	tables: CanvasTable[];
	width?: number;
	height?: number;
	hidden?: boolean;
}

interface ModalCanvasTabsProps {
	isOpen: boolean;
	title: string;
	sections: CanvasAreaSection[];
	selectedKey?: string;
	onSelectionChange?: (key: string) => void;
	onAddArea?: () => void;
	onClose: () => void;
	isPending?: boolean;
}

function getTableColor(status: CanvasTable["status"]) {
	switch (status) {
		case "occupied":
			return "#F87171";
		case "reserved":
			return "#FBBF24";
		default:
			return "#34D399";
	}
}

function CanvasArea({ section }: { section: CanvasAreaSection }) {
	const width = section.width ?? 900;
	const height = section.height ?? 520;

	return (
		<div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm">
			<div className="mb-3 text-sm font-semibold text-slate-600">
				{section.title}
			</div>
			<div className="overflow-auto rounded-3xl border border-slate-200 bg-slate-50">
				<Stage width={width} height={height}>
					<Layer>
						{section.tables.map((table) => (
							<Group key={table.id}>
								<Rect
									x={table.x}
									y={table.y}
									width={table.width}
									height={table.height}
									fill={getTableColor(table.status)}
									cornerRadius={16}
									shadowBlur={8}
									shadowColor="rgba(0,0,0,0.08)"
								/>
								<Text
									x={table.x}
									y={table.y + table.height / 2 - 10}
									width={table.width}
									align="center"
									text={table.label}
									fontSize={14}
									fill="#ffffff"
									fontStyle="bold"
								/>
							</Group>
						))}
					</Layer>
				</Stage>
			</div>
		</div>
	);
}

function ModalCanvasTabs({
	isOpen,
	title,
	sections,
	selectedKey,
	onSelectionChange,
	onAddArea,
	onClose,
	isPending = false,
}: ModalCanvasTabsProps) {
	const visibleSections = sections.filter((section) => !section.hidden);
	const [activeTab, setActiveTab] = useState(visibleSections[0]?.key ?? "");

	useEffect(() => {
		if (selectedKey) {
			setActiveTab(selectedKey);
		}
	}, [selectedKey]);

	useEffect(() => {
		if (!visibleSections.some((section) => section.key === activeTab)) {
			setActiveTab(visibleSections[0]?.key ?? "");
		}
	}, [visibleSections, activeTab]);

	const handleTabChange = (key: string) => {
		setActiveTab(key);
		onSelectionChange?.(key);
	};

	return (
		<ModalCustom
			open={isOpen}
			onOpenChange={(open) => !open && onClose()}
			title={title}
			size="lg"
		>
			{isPending ? (
				<div className="flex h-60 items-center justify-center">
					Đang tải...
				</div>
			) : (
				<>
					<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
						<Tabs
							variant="secondary"
							className="flex-1"
							selectedKey={activeTab}
							onSelectionChange={(key) =>
								handleTabChange(String(key))
							}
						>
							<Tabs.ListContainer className="w-full flex flex-row flex-nowrap gap-3 overflow-x-auto">
								<Tabs.List aria-label="Khu vực">
									{visibleSections.map((section) => (
										<Tabs.Tab
											key={section.key}
											id={section.key}
											className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold data-[selected=true]:bg-[#6f4e37] data-[selected=true]:text-white data-[selected=false]:text-slate-600"
										>
											{section.title}
											<Tabs.Indicator className="bg-[#6f4e37] rounded-full" />
										</Tabs.Tab>
									))}
								</Tabs.List>
							</Tabs.ListContainer>
						</Tabs>

						{onAddArea && (
							<Button variant="danger-soft" onPress={onAddArea}>
								Thêm khu vực
							</Button>
						)}
					</div>

					{visibleSections.map((section) => (
						<div
							key={section.key}
							className={
								activeTab === section.key ? "block" : "hidden"
							}
						>
							<CanvasArea section={section} />
						</div>
					))}
				</>
			)}
		</ModalCustom>
	);
}

export default ModalCanvasTabs;
