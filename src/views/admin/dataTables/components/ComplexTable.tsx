import { useMemo } from 'react';

import { Flex, Table, Progress, Icon, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import { MdCheckCircle, MdCancel, MdOutlineError } from 'react-icons/md';
import { useGlobalFilter, usePagination, useSortBy, useTable, Column } from 'react-table';

export type DataTableProps<Data extends object> = {
	data: Data[];
	columns: Column<Data>[];
};

const ColumnsTable = <Data extends object>({ data, columns }: DataTableProps<Data>) => {
	const columnsData = useMemo(() => columns, [columns]);
	const dataCell = useMemo(() => data, [data]);

	const tableInstance = useTable(
		{
			columns: columnsData,
			data: dataCell,
		},
		useGlobalFilter,
		useSortBy,
		usePagination,
	);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	return (
		<Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
			<Flex px="25px" justify="space-between" mb="20px" align="center">
				<Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
					Complex Table
				</Text>
				<Menu />
			</Flex>
			<Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
				<Thead>
					{headerGroups.map((headerGroup, index) => (
						<Tr {...headerGroup.getHeaderGroupProps()} key={index.toString()}>
							{headerGroup.headers.map((column, i) => (
								<Th
									{...column.getHeaderProps(column.getSortByToggleProps())}
									pe="10px"
									key={i.toString()}
									borderColor={borderColor}
								>
									<Flex justify="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
										{column.render('Header')}
									</Flex>
								</Th>
							))}
						</Tr>
					))}
				</Thead>
				<Tbody {...getTableBodyProps()}>
					{rows.map((row, index) => {
						prepareRow(row);
						return (
							<Tr {...row.getRowProps()} key={index.toString()}>
								{row.cells.map((cell, i) => {
									let d;
									if (cell.column.Header === 'NAME') {
										d = (
											<Text color={textColor} fontSize="sm" fontWeight="700">
												{cell.value}
											</Text>
										);
									} else if (cell.column.Header === 'STATUS') {
										d = (
											<Flex align="center">
												<Icon
													w="24px"
													h="24px"
													me="5px"
													color={
														cell.value === 'Approved'
															? 'green.500'
															: cell.value === 'Disable'
															? 'red.500'
															: cell.value === 'Error'
															? 'orange.500'
															: ''
													}
													as={
														cell.value === 'Approved'
															? MdCheckCircle
															: cell.value === 'Disable'
															? MdCancel
															: cell.value === 'Error'
															? MdOutlineError
															: undefined
													}
												/>
												<Text color={textColor} fontSize="sm" fontWeight="700">
													{cell.value}
												</Text>
											</Flex>
										);
									} else if (cell.column.Header === 'DATE') {
										d = (
											<Text color={textColor} fontSize="sm" fontWeight="700">
												{cell.value}
											</Text>
										);
									} else if (cell.column.Header === 'PROGRESS') {
										d = (
											<Flex align="center">
												<Progress
													variant="table"
													colorScheme="brandScheme"
													h="8px"
													w="108px"
													value={cell?.value as number}
												/>
											</Flex>
										);
									}
									return (
										<Td
											{...cell.getCellProps()}
											key={i.toString()}
											fontSize={{ sm: '14px' }}
											minW={{ sm: '150px', md: '200px', lg: 'auto' }}
											borderColor="transparent"
										>
											{d}
										</Td>
									);
								})}
							</Tr>
						);
					})}
				</Tbody>
			</Table>
		</Card>
	);
};

export default ColumnsTable;
