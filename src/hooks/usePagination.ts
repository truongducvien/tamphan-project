import { Ref, useRef, useState } from 'react';

import { PaginationProps, PaginationRef } from 'src/components/pagination';

export interface ReturnProps extends PaginationProps {
	resetPage: () => void;
	dispatchInfo: <T extends object>(
		data?: {
			items: T[];
			pageNum: number;
			pageSize: number;
			totalItems: number;
			totalPages: number;
		} | null,
	) => void;
	ref: Ref<PaginationRef>;
}

export const usePagination = (): ReturnProps => {
	const ref = useRef<PaginationRef>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState<number>(10);
	const [pageInfo, setPageInfo] = useState<{ total: number; hasNextPage: boolean; hasPreviousPage: boolean }>({
		total: 0,
		hasNextPage: false,
		hasPreviousPage: false,
	});

	const resetPage = () => {
		setCurrentPage(1);
		ref.current?.reset();
	};
	const dispatchInfo = <T extends object>(
		data?: {
			items: T[];
			pageNum: number;
			pageSize: number;
			totalItems: number;
			totalPages: number;
		} | null,
	) => {
		const page = {
			total: data?.totalPages || 0,
			totalItems: data?.totalItems || 0,
			hasNextPage: data ? currentPage < data?.totalPages : false,
			hasPreviousPage: data ? currentPage > 0 : false,
		};
		setPageInfo(page);
	};

	const onPageSizeChange = (v: number) => {
		setCurrentPage(1);
		setCurrentPageSize(v);
	};

	return {
		value: currentPage,
		onPageChange: setCurrentPage,
		pageSize: currentPageSize,
		onPageSizeChange,
		resetPage,
		dispatchInfo,
		ref,
		...pageInfo,
	};
};
