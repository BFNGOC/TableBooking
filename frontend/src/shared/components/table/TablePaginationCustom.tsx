import { Table, Pagination, Skeleton } from '@heroui/react';
import CustomEmpty from '../empty/CustomEmpty';
import { MetaPagination } from '@/shared/types/meta-pagination';
import CustomCard from '../card/CustomCard';

export interface ColumnTable {
    id: string;
    name: string;
}

interface TablePaginationCustomProps<T> {
    columns: ColumnTable[];
    data: T[];
    onChangPage: (page: number) => void;
    className?: string;
    pagination: MetaPagination;
    isPending: boolean;
}

const TablePaginationCustom = <T extends object>({
    columns,
    data,
    onChangPage,
    className,
    pagination,
    isPending,
}: TablePaginationCustomProps<T>) => {
    const { currentPage, totalPages, totalItems, pageSize } = pagination;

    function getVisiblePages(page: number, totalPages: number, delta = 2) {
        const range: number[] = [];

        const start = Math.max(1, page - delta);
        const end = Math.min(totalPages, page + delta);

        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        return range;
    }

    const hasData = totalItems > 0;

    const visiblePages = hasData ? getVisiblePages(currentPage, totalPages) : [];

    const start = hasData ? (currentPage - 1) * pageSize + 1 : 0;

    const end = hasData ? Math.min(currentPage * pageSize, totalItems) : 0;

    const skeletonRows = Array.from({ length: 3 }, (_, index) => ({
        _id: `skeleton-${index}`,
    }));

    return (
        <CustomCard>
            <Table className={className}>
                <Table.ScrollContainer>
                    <Table.Content aria-label="Table with pagination" className="min-w-150">
                        <Table.Header columns={columns}>
                            {(column) => (
                                <Table.Column key={column.id} isRowHeader={column.id === 'name'}>
                                    {column.name}
                                </Table.Column>
                            )}
                        </Table.Header>

                        <Table.Body
                            items={isPending ? skeletonRows : data}
                            renderEmptyState={() => <CustomEmpty />}
                        >
                            {(row: any) => (
                                <Table.Row key={row._id}>
                                    {columns.map((column) => (
                                        <Table.Cell key={column.id}>
                                            {isPending ? (
                                                <Skeleton className="h-5 w-full rounded-md" />
                                            ) : (
                                                row[column.id]
                                            )}
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>

                <Table.Footer>
                    <Pagination size="sm">
                        <Pagination.Summary>
                            {start} - {end} trong {totalItems} kết quả
                        </Pagination.Summary>

                        <Pagination.Content>
                            <Pagination.Item>
                                <Pagination.Previous
                                    isDisabled={currentPage === 1}
                                    onPress={() => onChangPage(currentPage - 1)}
                                >
                                    <Pagination.PreviousIcon />
                                    Prev
                                </Pagination.Previous>
                            </Pagination.Item>

                            {visiblePages.map((p) => (
                                <Pagination.Item key={p}>
                                    <Pagination.Link
                                        isActive={p === currentPage}
                                        className={
                                            p === currentPage
                                                ? 'bg-[#6f4e37] text-white font-semibold'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }
                                        onPress={() => onChangPage(p)}
                                    >
                                        {p}
                                    </Pagination.Link>
                                </Pagination.Item>
                            ))}

                            <Pagination.Item>
                                <Pagination.Next
                                    isDisabled={currentPage === totalPages}
                                    onPress={() => onChangPage(currentPage + 1)}
                                >
                                    Next
                                    <Pagination.NextIcon />
                                </Pagination.Next>
                            </Pagination.Item>
                        </Pagination.Content>
                    </Pagination>
                </Table.Footer>
            </Table>
        </CustomCard>
    );
};

export default TablePaginationCustom;
