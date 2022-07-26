import React, { useState, useEffect } from 'react';

import {
	Table as ChakraTable,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Flex,
	Spinner,
	useColorModeValue,
	Text,
	Icon,
} from '@chakra-ui/react';
import Pagination, { PaginationProps } from 'components/pagination';
import { FaTrashAlt } from 'react-icons/fa';
import { MdBorderColor } from 'react-icons/md';
import { PermistionAction as PermistionActionBase } from 'variables/permission';

export type DataTable = { [k: string]: boolean | number | string | undefined | DataTable };
export type PermissionAction = PermistionActionBase.EDIT | PermistionActionBase.DETETE;

export type IColumn<T> = {
	key?: keyof T;
	label: string;
	cell?: (value: T) => React.ReactNode;
};

type TableProps<T> = {
	data: Array<T>;
	columns: Array<IColumn<T>>;
	keyField: string;
	toggleAllRowsSelected?: boolean;
	testId?: string;
	pagination?: PaginationProps;
	loading?: boolean;
	action?: PermissionAction | PermissionAction[];
	onClickEdit?: (row: T) => void;
	onClickDelete?: (row: T) => void;
	onSelectionChange?: (selectedKeys: string[]) => void;
};

const Table = <T extends DataTable>({
	data = [],
	keyField,
	toggleAllRowsSelected,
	columns,
	testId,
	pagination,
	loading,
	action,
	onClickEdit,
	onClickDelete,
	onSelectionChange,
}: TableProps<T>): JSX.Element => {
	const [selectedKeys, setSelectedKeys] = useState<string[]>(
		toggleAllRowsSelected === true ? data.map(row => row[keyField] as string) : [],
	);
	const handleOnClick = (row: T) => {
		if (!selectedKeys || (selectedKeys && selectedKeys.indexOf(row[keyField] as string)) === -1) {
			setSelectedKeys([...(selectedKeys || []), row[keyField] as string]);
		} else {
			setSelectedKeys(selectedKeys?.filter(item => item !== row[keyField]));
		}
	};

	useEffect(() => {
		onSelectionChange?.(selectedKeys || []);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedKeys]);

	useEffect(() => {
		setSelectedKeys(toggleAllRowsSelected === true ? data.map(row => row[keyField] as string) : []);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [toggleAllRowsSelected]);
	const textColor = useColorModeValue('secondaryGray.900', 'whiteSmoke.100');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	const iconDelete = useColorModeValue('red.300', 'red.800');
	return (
		<Flex
			data-testid={testId}
			flexDirection="column"
			flex={1}
			maxWidth="100%"
			width="100%"
			overflowX="auto"
			overflowY="auto"
			boxSizing="border-box"
		>
			<ChakraTable variant="unstyled">
				<Thead borderBottomColor={borderColor} borderBottomWidth={1}>
					{columns && (
						<Tr>
							{columns.map((column, index) => (
								<Th fontSize={{ sm: '10px', lg: '12px' }} color="gray.400" key={index}>
									{column.label}
								</Th>
							))}
							{action && <Th>Actions</Th>}
						</Tr>
					)}
				</Thead>
				{loading ? (
					<Flex minH={200} justify="center" align="center" transform="auto-gpu" translateX="50%">
						<Spinner />
					</Flex>
				) : (
					<Tbody flexDirection="column">
						{data.map((row, index) => {
							return (
								<Tr
									key={index}
									bg={selectedKeys && selectedKeys.indexOf(row[keyField] as string) > -1 ? 'made.40' : undefined}
									onClick={() => handleOnClick(row)}
									data-testid={`row-${index}`}
								>
									{columns.map((column, colIndex) => (
										<Td key={`${index}${colIndex}`}>
											{column.cell && column.key ? (
												column.cell(row)
											) : (
												<Text color={textColor} fontSize="sm" fontWeight="700">
													{column.key ? (row[column.key] as string) : ''}
												</Text>
											)}
										</Td>
									))}
									{action && (
										<Td>
											<Flex justify="space-evenly" align="center">
												{action.includes(PermistionActionBase.EDIT) && (
													<Icon onClick={() => onClickEdit?.(row)} as={MdBorderColor} />
												)}
												{action.includes(PermistionActionBase.DETETE) && (
													<Icon as={FaTrashAlt} onClick={() => onClickDelete?.(row)} color={iconDelete} />
												)}
											</Flex>
										</Td>
									)}
								</Tr>
							);
						})}
					</Tbody>
				)}
			</ChakraTable>
			{pagination && <Pagination {...pagination} />}
		</Flex>
	);
};
export default Table;
