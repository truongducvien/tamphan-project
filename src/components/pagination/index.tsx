import { ChangeEvent, useMemo } from 'react';

import {
	Pagination as ChakraPagination,
	usePagination,
	PaginationPage,
	PaginationNext,
	PaginationPrevious,
	PaginationPageGroup,
	PaginationContainer,
	PaginationSeparator,
} from '@ajna/pagination';
import { Icon, Select } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'react-feather';

const PAGE_SIZE_OPTIONS = [
	{ value: '5', text: '5' },
	{ value: '25', text: '25' },
	{ value: '50', text: '50' },
	{ value: 'ALL', text: 'All' },
];

export type PaginationProps = {
	total: number;
	pageSize: number;
	value?: number;
	isHidden?: boolean;
	hasNextPage?: boolean;
	hasPreviousPage?: boolean;
	onPageChange?: (page: number) => void;
	onPageSizeChange?: (pageSize: number) => void;
};

const Pagination = ({
	total,
	pageSize,
	isHidden = false,
	hasNextPage = false,
	hasPreviousPage = false,
	onPageChange,
	onPageSizeChange,
	value = 1,
}: PaginationProps): JSX.Element | null => {
	const totalPages = useMemo(() => {
		return Math.round(total / pageSize) || total;
	}, [total, pageSize]);

	const { currentPage, setCurrentPage, pages } = usePagination({
		pagesCount: totalPages,
		initialState: { currentPage: value, pageSize },
		limits: {
			outer: 1,
			inner: 2,
		},
	});

	const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>): void => {
		const pS = event.target.value === 'ALL' ? total : Number(event.target.value);
		onPageSizeChange?.(pS);
	};

	const handlePageChange = (nextPage: number): void => {
		setCurrentPage(nextPage);
		onPageChange?.(nextPage);
	};

	if (isHidden) return null;

	return (
		<ChakraPagination pagesCount={total} currentPage={currentPage} onPageChange={handlePageChange}>
			<PaginationContainer mt={5} align="center" justify="center" p={4} w="full">
				<Select
					data-testid="page-size-dropdown"
					onChange={handlePageSizeChange}
					size="md"
					ml={1}
					value={pageSize === total ? 'ALL' : pageSize}
					bg="made.5"
					_hover={{ bg: 'made.80' }}
					width={70}
				>
					{PAGE_SIZE_OPTIONS.map(option => (
						<option key={option.value} value={option.value}>
							{option.text}
						</option>
					))}
				</Select>
				<PaginationPrevious
					data-testid="previous-button"
					disabled={!hasPreviousPage}
					color="white"
					bg="made.black"
					_hover={{ bg: 'made.80' }}
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					leftIcon={<Icon as={ChevronLeft} />}
					size="lg"
					onClick={() => console.warn("I'm clicking the previous")}
					mr={1}
				/>
				<PaginationPageGroup
					isInline
					align="center"
					separator={
						<PaginationSeparator
							isDisabled={!hasNextPage && !hasPreviousPage}
							onClick={() => console.warn("I'm clicking the separator")}
							color="white"
							bg="made.black"
							_hover={{ bg: 'made.80' }}
							size="lg"
							w={7}
							jumpSize={1}
						/>
					}
				>
					{pages.map((page: number) => (
						<PaginationPage
							key={`pagination_page_${page}`}
							page={page}
							onClick={() => console.warn('Im clicking the page')}
							size="lg"
							fontSize="sm"
							w="10"
							_hover={{ bg: 'made.80' }}
							_current={{
								bg: 'made.black',
								fontSize: 'sm',
								color: 'white',
								w: 7,
							}}
						/>
					))}
				</PaginationPageGroup>
				<PaginationNext
					data-testid="next-button"
					isDisabled={!hasNextPage}
					onClick={() => console.warn("I'm clicking the next")}
					color="white"
					bg="made.black"
					_hover={{ bg: 'made.80' }}
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					rightIcon={<Icon as={ChevronRight} />}
					size="lg"
					ml={1}
				/>
			</PaginationContainer>
		</ChakraPagination>
	);
};
export default Pagination;
