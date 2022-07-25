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
import { Icon, Select, useColorModeValue } from '@chakra-ui/react';
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

	const textColor = useColorModeValue('black', 'white');
	const activeTextColor = useColorModeValue('white', 'white');

	const bgColor = useColorModeValue('secondaryGray.400', 'made.black');
	const acticeBgColor = useColorModeValue('blue.500', 'blue.800');

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
					color={textColor}
					bg="made.100"
					_hover={{ bg: 'made.80' }}
					leftIcon={<Icon as={ChevronLeft} />}
					size="lg"
					mr={1}
				/>
				<PaginationPageGroup
					isInline
					align="center"
					separator={
						<PaginationSeparator
							isDisabled={!hasNextPage && !hasPreviousPage}
							color={textColor}
							bg={bgColor}
							_hover={{ bg: 'made.80' }}
							size="md"
							w={7}
							jumpSize={1}
						/>
					}
				>
					{pages.map((page: number) => (
						<PaginationPage
							key={`pagination_page_${page}`}
							page={page}
							size="md"
							fontSize="sm"
							w={10}
							bg={bgColor}
							_hover={{ bg: 'made.80' }}
							_current={{
								color: activeTextColor,
								bg: acticeBgColor,
								fontSize: 'sm',
								size: 'lg',
								w: 10,
							}}
						/>
					))}
				</PaginationPageGroup>
				<PaginationNext
					data-testid="next-button"
					isDisabled={!hasNextPage}
					color={textColor}
					bg="mediumslateblue.100"
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
