import { useState, useEffect } from 'react';

import { Table as ChakraTable, Thead, Tbody, Tr, Th, Td, Flex, Spinner, Center, Container } from '@chakra-ui/react';
import Pagination, { PaginationProps } from 'components/pagination';

type TableProps<T> = {
	data: T[];
	keyField: string;
	toggleAllRowsSelected?: boolean;
	onSelectionChange?: (selectedKeys: string[]) => void;
	columns: {
		key?: string;
		label: string;
	}[];
	testId?: string;
	pagination?: PaginationProps;
	loading?: boolean;
};

const Table = <T extends Record<string, string>>({
	data = [],
	keyField,
	toggleAllRowsSelected,
	onSelectionChange,
	columns,
	testId,
	pagination,
	loading,
}: TableProps<T>): JSX.Element => {
	const [selectedKeys, setSelectedKeys] = useState(
		toggleAllRowsSelected === true ? data.map(row => row[keyField]) : [],
	);
	const handleOnClick = (row: T) => {
		if (!selectedKeys || (selectedKeys && selectedKeys.indexOf(row[keyField])) === -1) {
			setSelectedKeys([...(selectedKeys || []), row[keyField]]);
		} else {
			setSelectedKeys(selectedKeys?.filter(item => item !== row[keyField]));
		}
	};

	useEffect(() => {
		onSelectionChange?.(selectedKeys || []);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setSelectedKeys(toggleAllRowsSelected === true ? data.map(row => row[keyField]) : []);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [toggleAllRowsSelected]);

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
				<Thead>
					{columns && (
						<Tr>
							{columns.map((column, index) => (
								<Th key={index}>{column.label}</Th>
							))}
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
									bg={selectedKeys && selectedKeys.indexOf(row[keyField]) > -1 ? 'made.40' : undefined}
									onClick={() => handleOnClick(row)}
									data-testid={`row-${index}`}
								>
									{columns.map((column, colIndex) => (
										<Td key={`${index}${colIndex}`}>{column.key ? row[column.key] : ''}</Td>
									))}
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
