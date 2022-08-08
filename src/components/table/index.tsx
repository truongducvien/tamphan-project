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
} from '@chakra-ui/react';
import Pagination, { PaginationProps } from 'components/pagination';
import { FaTrashAlt } from 'react-icons/fa';
import { MdBorderColor, MdPreview } from 'react-icons/md';
import { PermistionAction as PermistionActionBase } from 'variables/permission';

export type DataTable = { [k: string]: boolean | number | string | undefined | DataTable };
export type PermissionAction = PermistionActionBase.EDIT | PermistionActionBase.DETETE | PermistionActionBase.VIEW;

export type IColumn<T> = {
	key?: keyof T;
	label: string;
	cell?: (value: T) => React.ReactNode;
};

type TableProps<T> = {
	data: Array<T>;
	minWith?: string;
	columns: Array<IColumn<T>>;
	keyField: string;
	testId?: string;
	pagination?: PaginationProps;
	loading?: boolean;
	action?: PermissionAction | PermissionAction[];
	onClickEdit?: (row: T) => void;
	onClickDelete?: (row: T) => void;
	onClickDetail?: (row: T) => void;
};

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
}: TableProps<T>): JSX.Element => {
	const textColor = useColorModeValue('gray.600', 'whiteSmoke.100');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	const iconDelete = useColorModeValue('red.300', 'red.800');
	return (
		<>
			<Box
				data-testid={testId}
				flexDirection="column"
				width="100%"
				height="100%"
				flex={1}
				overflowX="scroll"
				overflowY="scroll"
				boxSizing="border-box"
			>
				<ChakraTable variant="unstyled" minW={minWith || '100%'}>
					<Thead borderBottomColor={borderColor} borderBottomWidth={1}>
						{columns && (
							<Tr>
								{columns.map((column, index) => (
									<Th fontSize={{ sm: '10px', lg: '12px' }} color="gray.400" key={index}>
										{column.label}
									</Th>
								))}
								{action && (
									<Th fontSize={{ sm: '10px', lg: '12px' }} color="gray.400" textAlign="center">
										Actions
									</Th>
								)}
							</Tr>
						)}
					</Thead>
					{loading ? (
						<Tbody flexDirection="column">
							<Tr width="100vw" height={200} position="relative">
								<Td>
									<Spinner position="absolute" left="50%" top="50%" />
								</Td>
							</Tr>
						</Tbody>
					) : (
						<Tbody flexDirection="column">
							{data.map((row, index) => {
								return (
									<Tr key={index} bg="made.40" data-testid={`row-${index}`}>
										{columns.map((column, colIndex) => (
											<Td key={`${index}${colIndex}`}>
												{column.cell && column.key ? (
													column.cell(row)
												) : (
													<Text color={textColor} fontSize="sm" fontWeight="700">
														{column.key ? (row[column.key] as unknown as string) : ''}
													</Text>
												)}
											</Td>
										))}
										{action && (
											<Td>
												<HStack justify="center" align="center">
													{action.includes(PermistionActionBase.EDIT) && (
														<Icon onClick={() => onClickDetail?.(row)} as={MdPreview} cursor="pointer" />
													)}
													{action.includes(PermistionActionBase.EDIT) && (
														<Icon onClick={() => onClickEdit?.(row)} as={MdBorderColor} cursor="pointer" />
													)}
													{action.includes(PermistionActionBase.DETETE) && (
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
									</Tr>
								);
							})}
						</Tbody>
					)}
				</ChakraTable>
			</Box>
			{pagination && <Pagination {...pagination} />}
		</>
	);
};
export default Table;
