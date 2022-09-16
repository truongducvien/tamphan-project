import React from 'react';

import {
	Table as ChakraTable,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Spinner,
	useColorModeValue,
	Text,
	Icon,
	HStack,
	Box,
	Center,
	TableProps as BaseProps,
} from '@chakra-ui/react';
import { CSSObject } from '@emotion/react';
import dayjs from 'dayjs';
import { FaTrashAlt } from 'react-icons/fa';
import { MdBorderColor, MdPreview } from 'react-icons/md';
import { Option } from 'src/components/form/PullDown';
import Pagination, { PaginationProps } from 'src/components/pagination';
import { Tag } from 'src/components/tag';
import { PermistionAction } from 'src/variables/permission';

export type DataTable = { [k: string]: boolean | number | string | undefined | DataTable };

export type IColumn<T> = {
	key?: keyof T;
	label: string;
	isCenter?: boolean;
	cell?: (value: T) => React.ReactNode;
	tag?: (value: T) => Option | undefined;
	dateFormat?: string;
};

type TableProps<T> = {
	data: Array<T>;
	minWith?: string;
	columns: Array<IColumn<T>>;
	testId?: string;
	pagination?: PaginationProps;
	loading?: boolean;
	action?: PermistionAction[] | PermistionAction;
	onClickEdit?: (row: T) => void;
	onClickDelete?: (row: T) => void;
	onClickDetail?: (row: T) => void;
	styleCss?: CSSObject;
	editable?: (row: T) => boolean;
} & BaseProps;

const Table = <T,>({
	data = [],
	columns,
	testId,
	pagination,
	loading,
	action,
	minWith,
	onClickEdit,
	onClickDelete,
	onClickDetail,
	editable,
	...innerProps
}: TableProps<T>): JSX.Element => {
	const textColor = useColorModeValue('gray.600', 'whiteSmoke.100');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	const iconDelete = useColorModeValue('red.300', 'red.800');
	const scrollColor = useColorModeValue('blue.500', 'blue.800');
	const bg = useColorModeValue('gray.100', 'blue.800');

	return (
		<>
			<Box
				data-testid={testId}
				flexDirection="column"
				width="100%"
				height="100%"
				flex={1}
				overflowX="auto"
				boxSizing="border-box"
				minH={200}
				sx={{
					'&::-webkit-scrollbar': {
						height: '7px',
						width: '7px',
						borderRadius: '8px',
						backgroundColor: borderColor,
					},
					'&::-webkit-scrollbar-thumb': {
						backgroundColor: scrollColor,
						borderRadius: '8px',
					},
				}}
			>
				{(loading || !data?.[0]) && (
					<Box width="100%" height={280} position="absolute" zIndex="auto">
						<Center position="absolute" left="50%" top="40%" transform="translate(-50%, 0px)">
							{loading ? <Spinner color="blue.500" emptyColor="gray.200" speed="0.65s" /> : 'Không có dữ liệu'}
						</Center>
					</Box>
				)}
				<Box
					maxH={innerProps.maxH}
					sx={{
						'&::-webkit-scrollbar': {
							height: '5px',
							borderRadius: '8px',
							backgroundColor: 'red',
						},
						'&::-webkit-scrollbar-thumb': {
							backgroundColor: scrollColor,
						},
					}}
				>
					<ChakraTable minW={minWith || '100%'} {...innerProps}>
						<Thead
							borderBottomColor={borderColor}
							borderBottomWidth={1}
							{...(innerProps.maxH ? { position: 'sticky', zIndex: 'docked' } : {})}
							top={0}
							bg={bg}
						>
							{columns && (
								<Tr>
									{action && (
										<Th fontSize={{ sm: '10px', lg: '12px' }} color="gray.400" textAlign="center">
											Thao tác
										</Th>
									)}
									{columns.map((column, index) => (
										<Th
											fontSize={{ sm: '10px', lg: '12px' }}
											textAlign={column.tag || column?.isCenter ? 'center' : 'start'}
											color="gray.400"
											key={index}
										>
											{column.label}
										</Th>
									))}
								</Tr>
							)}
						</Thead>

						<Tbody flexDirection="column">
							{data.map((row, index) => {
								return (
									<Tr key={index} bg="made.40" data-testid={`row-${index}`}>
										{action && (
											<Td>
												<HStack justify="center" align="center">
													{action.includes(PermistionAction.VIEW) && (
														<Icon onClick={() => onClickDetail?.(row)} as={MdPreview} cursor="pointer" />
													)}
													{action.includes(PermistionAction.UPDATE) && (
														<Icon
															onClick={() => (editable && !editable(row) ? {} : onClickEdit?.(row))}
															as={MdBorderColor}
															cursor={editable && !editable(row) ? undefined : 'pointer'}
															color={editable && !editable(row) ? 'gray' : undefined}
														/>
													)}
													{action.includes(PermistionAction.DELETE) && (
														<Icon
															as={FaTrashAlt}
															onClick={() => onClickDelete?.(row)}
															color={iconDelete}
															cursor="pointer"
														/>
													)}
												</HStack>
											</Td>
										)}
										{columns.map((column, colIndex) => (
											<Td key={`${index}${colIndex}`} color={textColor} fontSize="sm" fontWeight="700">
												{column.cell && column.key ? (
													column.cell(row)
												) : column.tag && column.tag(row) ? (
													<Center>
														<Tag colorScheme={column.tag(row)?.colorScheme}>{column.tag(row)?.label}</Tag>
													</Center>
												) : (
													<Text color={textColor} fontSize="sm" fontWeight="700" maxH={100} maxW={500} overflowY="auto">
														{column.key
															? column.dateFormat && row[column.key]
																? dayjs(row[column.key] as unknown as string).format(column.dateFormat)
																: (row[column.key] as unknown as string)
															: ''}
													</Text>
												)}
											</Td>
										))}
									</Tr>
								);
							})}
						</Tbody>
					</ChakraTable>
				</Box>
			</Box>
			{pagination && <Pagination {...pagination} isLoading={loading} />}
		</>
	);
};
export default Table;
