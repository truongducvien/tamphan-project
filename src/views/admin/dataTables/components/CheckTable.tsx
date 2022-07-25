import { useMemo } from 'react';

import { Flex, Table, Checkbox, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import { useGlobalFilter, usePagination, useSortBy, useTable, Column } from 'react-table';

export type DataTableProps<Data extends object> = {
	data: Data[];
	columns: Column<Data>[];
};

const DataTable = <Data extends object>({ data, columns }: DataTableProps<Data>) => {
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
					Check Table
				</Text>
				<Menu />
			</Flex>
			<Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
				<Thead>
					{headerGroups.map((headerGroup, index) => (
						// eslint-disable-next-line react/no-array-index-key
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
											<Flex align="center">
												{/* eslint-disable */}
												<Checkbox defaultChecked={cell?.value?.[1]} colorScheme="brandScheme" me="10px" />
												<Text color={textColor} fontSize="sm" fontWeight="700">
													{cell?.value?.[0]}
												</Text>
											</Flex>
										);
									} else if (cell.column.Header === 'PROGRESS') {
										d = (
											<Flex align="center">
												<Text me="10px" color={textColor} fontSize="sm" fontWeight="700">
													{cell.value}%
												</Text>
											</Flex>
										);
									} else if (cell.column.Header === 'QUANTITY') {
										d = (
											<Text color={textColor} fontSize="sm" fontWeight="700">
												{cell.value}
											</Text>
										);
									} else if (cell.column.Header === 'DATE') {
										d = (
											<Text color={textColor} fontSize="sm" fontWeight="700">
												{cell.value}
											</Text>
										);
									}
									return (
										<Td
											{...cell.getCellProps()}
											key={i}
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

export default DataTable;
