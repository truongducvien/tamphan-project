/* eslint-disable @typescript-eslint/ban-types */
import { useEffect, useMemo, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

interface Params<D, R> {
	id: string[];
	payload: R;
	func: (payload: R) => Promise<{
		items: D[];
		pageNum: number;
		pageSize: number;
		totalItems: number;
		totalPages: number;
		nextPage?: number;
	} | null>;
}

export const useLoadMore = <D, R>({ id, func, payload }: Params<D, R>) => {
	const [currentPage, setPage] = useState(0);
	const [data, setData] = useState<D[]>([]);
	const loadingRef = useRef(false);
	const {
		data: dataLoader,
		isLoading,
		isError,
		isFetched,
	} = useQuery([...id, currentPage], () => func({ ...payload, page: currentPage }), {
		onSuccess: res => {
			setData(prev => [...prev, ...(res?.items || [])]);
		},
	});

	useEffect(() => {
		loadingRef.current = isLoading;
	}, [isLoading]);

	const hasNextPage = useMemo(() => {
		if (!dataLoader || dataLoader?.items?.length < 1 || !dataLoader.nextPage) return false;
		if (dataLoader.nextPage >= dataLoader.totalPages) return false;
		return true;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataLoader?.items, isLoading]);

	const fetchMore = () =>
		new Promise<void>(() => {
			if (!hasNextPage) return;
			setPage(prev => prev + 1);
		});

	return { data, isLoading, isError, isFetched, fetchMore };
};
